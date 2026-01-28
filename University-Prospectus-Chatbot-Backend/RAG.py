import os
import requests
from dotenv import load_dotenv
from langchain_openai import AzureChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from arize.otel import register, Endpoint
from openinference.instrumentation.langchain import LangChainInstrumentor

load_dotenv()

def log(message: str):
    verbose = os.environ.get("VERBOSE", "false")
    if verbose.lower() == "true":
        print(message, flush=True)


tracer_provider = register(
    space_id=os.getenv("ARIZE_SPACE_ID"),
    api_key=os.getenv("ARIZE_API_KEY"),
    project_name="university-rag-backend",
    endpoint=Endpoint.ARIZE_EUROPE, 
    log_to_console=True           
)

LangChainInstrumentor().instrument(tracer_provider=tracer_provider)
log("LangChain tracing za Arize AX je uključen.")


llm = AzureChatOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    deployment_name=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
    temperature=0.1
)

user_chat_histories = {}

def vector_search(search_text: str, index_name: str):
    api_key_search = os.getenv("COGNITIVESEARCHCONNECTOR5_API_KEY")
    index_endpoint = os.getenv("COGNITIVESEARCHCONNECTOR5_API_BASE")

    if not api_key_search:
        raise EnvironmentError("Azure Search API key is not set in environment variables.")
    if not index_endpoint:
        raise EnvironmentError("Azure Search endpoint is not set in environment variables.")

    search_url = f"{index_endpoint}/indexes/{index_name}/docs/search?api-version=2024-07-01"
    headers = {
        "api-key": api_key_search,
        "Content-Type": "application/json"
    }
    search_body = {
        "search": search_text,
        "count": True,
        "top": 5,
        "vectorQueries": [
            {
                "kind": "text",
                "text": search_text,
                "fields": "text_vector"
            }
        ],
        "queryType": "semantic",
        "captions": "extractive",
        "answers": "extractive|count-5"
    }
    try:
        response = requests.post(search_url, headers=headers, json=search_body, timeout=10)
        response.raise_for_status()
        search_results = response.json()

        results = search_results.get("value", [])

        log("\n==================== AZURE SEARCH DEBUG ====================")
        log(f"Upit: {search_text}")
        log(f"Index: {index_name}")
        log(f"Broj pronađenih dokumenata: {len(results)}\n")

        for idx, doc in enumerate(results, start=1):
            log(f"----- Rezultat {idx} -----")
            log(f"ID: {doc.get('id', 'nema-id')}")
            log(f"Search Score: {doc.get('@search.score', 'n/a')}")
            log(f"Chunk (prvih 200 char): {doc.get('chunk', '')[:200]}...")
            log("------------------------------------------------------------\n")

        log("-------kraj-------\n")

        context = "\n".join([doc.get("chunk", "") for doc in results])
        return context
    
    except requests.exceptions.Timeout:
        return "Error: Search request timed out."

    except requests.exceptions.HTTPError as http_err:
        return f"HTTP error: {http_err}"

    except requests.exceptions.RequestException as req_err:
        return f"Request error: {req_err}"

    except Exception as e:
        return f"Unexpected error: {str(e)}"
    

def rewrite_query(user_question: str, session_id: str = "default") -> str:
    chat_history = user_chat_histories.get(session_id, [])
    
    history_context = ""
    if chat_history:
        history_context = "\n\nPrevious conversation:\n"
        for msg in chat_history:
            if isinstance(msg, HumanMessage):
                history_context += f"Q: {msg.content}\n"
            elif isinstance(msg, AIMessage):
                history_context += f"A: {msg.content}\n"
    
    messages = [
        SystemMessage(content="""You are a query formatter that uses conversation history to clarify and expand user questions.

YOUR JOB:
1. Fix grammar and spelling
2. Expand ONLY these abbreviations: faks→fakultet, UDG→Univerzitet Donja Gorica
3. ANALYZE the history to understand what "to", "ih", "to", "oni", etc refer to
4. Expand vague pronouns based on history context
5. NEVER add information not mentioned in the question or history
6. Make the query clear for database search

DETAILED EXAMPLES:

Example 1 - Simple pronoun expansion:
History: 
  Q: Koliko ima predmeta na UDG?
  A: UDG ima 10 predmeta.
New Q: Koji su to?
Result Q: "Koji su to predmeti na UDG?" (expanded "to" = "predmeti na UDG")

Example 2 - Multiple context:
History:
  Q: Koliko ima ucionica?
  A: Univerzitet ima 20 ucionica.
New Q: Koliko ih ima po spratu?
Result Q: Koliko ima ucionica po spratu?

Example 3 - No clear history:
History: (empty or unrelated)
New Q: Koji su to?
Result: "Koji su to?" (keep vague - can't clarify)

Example 4 - Already clear:
History: "UDG ima 12 fakulteta"
New Q: "Napiši sve fakultete"
Result Q: "Napiši sve fakultete" (already clear, no change needed)

CRITICAL RULES:
- Extract the NOUN from history that matches the context
- Extract any QUALIFIERS (sa pravom, na UDG, itd)
- Combine them logically
- If unclear, keep the question as-is

Return ONLY the reformatted question, nothing else."""),
        HumanMessage(content=f"Question: {user_question}{history_context}")
    ]

    result = llm.invoke(messages)
    rewritten_question = result.content.strip()
    log(f"Original question: {user_question}")
    log(f"Rewritten question: {rewritten_question}")
    return rewritten_question

def ask_question(user_question: str, session_id: str = "default"):
    rewritten_question = rewrite_query(user_question, session_id)
    context = vector_search(rewritten_question, os.getenv("COGNITIVESEARCHCONNECTOR5_INDEX_NAME"))

    chat_history = user_chat_histories.get(session_id, [])

    messages = [
        SystemMessage(content="""
You are an assistant that answers questions using the provided documents and conversation history.
Use the Context provided and refer to the conversation history to answer questions.
If the answer is not found in either the Context or conversation history, respond: 'I could not find the answer in the provided documents.'
    """)
    ] + chat_history + [
        HumanMessage(content=f"Question: {rewritten_question}\n\nContext:\n{context}")
    ]

    result = llm.invoke(messages)
    answer = result.content

    token_usage = result.response_metadata.get("token_usage", {})
    log("\nTOKEN USAGE")
    log(f"Prompt tokens:     {token_usage.get('prompt_tokens', 0)}")
    log(f"Completion tokens: {token_usage.get('completion_tokens', 0)}")
    log(f"Total tokens:      {token_usage.get('total_tokens', 0)}")
  
    chat_history.append(HumanMessage(content=user_question))
    chat_history.append(AIMessage(content=answer))
    user_chat_histories[session_id] = chat_history

    print(f"Answer: {answer}")
    return answer


def start_chat():
    print("Ask me questions! Type 'quit' to exit.")
    while True:
        question = input("\nYour question: ")
        if question.lower() == "quit":
            print("Goodbye!")
            break
        ask_question(question)

if __name__ == "__main__":
    start_chat()
