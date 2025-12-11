import os
import requests
from dotenv import load_dotenv
from langchain_openai import AzureChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from arize.api import Client
from uuid import uuid4
from arize.utils.types import ModelTypes
from arize.utils.types import Environments
from arize.otel import register, Endpoint
from openinference.instrumentation.langchain import LangChainInstrumentor

load_dotenv()

# Log
def log(message: str):
    verbose = os.environ.get("VERBOSE", "false")
    if verbose.lower() == "true":
        print(message, flush=True)


# Arize OpenTelemetry Tracing setup
tracer_provider = register(
    space_id=os.getenv("ARIZE_SPACE_ID"),
    api_key=os.getenv("ARIZE_API_KEY"),
    project_name="university-rag-backend",
    endpoint=Endpoint.ARIZE_EUROPE,  # vazno!!
    log_to_console=True           
)

# Instrumentovanje LangChain da automatski šalje trace-ove u Arize AX
LangChainInstrumentor().instrument(tracer_provider=tracer_provider)
log("LangChain tracing za Arize AX je uključen.")

# Arize client
arize_client = Client(
    api_key=os.getenv("ARIZE_API_KEY"),
    space_id=os.getenv("ARIZE_SPACE_ID")
)


#LLM 
llm = AzureChatOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    deployment_name=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
    temperature=0.1
)

chat_history = []


# Pretraga (Azure Cognitive Search)
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
        response = requests.post(search_url,headers=headers,json=search_body,timeout=10)

        response.raise_for_status()
        search_results = response.json()

        #log(f"Full search results JSON: {search_results}")

        context = "\n".join(
            [result.get("chunk", "") for result in search_results.get("value", [])]
        )
        return context

    except requests.exceptions.Timeout:
        return "Error: Search request timed out."

    except requests.exceptions.HTTPError as http_err:
        return f"HTTP error: {http_err}"

    except requests.exceptions.RequestException as req_err:
        return f"Request error: {req_err}"

    except Exception as e:
        return f"Unexpected error: {str(e)}"
    

def rewrite_query(user_question: str) -> str:
    messages = [
        SystemMessage(content="""
Rewrite the user question so it is more suitable for searching in the document database.
KEEP THE SAME MEANING.
DO NOT add or guess any information.
DO NOT expand abbreviations unless they are unambiguous (e.g. “UDG” → “Univerzitet Donja Gorica”).
Return ONLY the rewritten question, nothing else.
"""),
        HumanMessage(content=user_question)
    ]

    result = llm.invoke(messages)
    rewritten_question = result.content.strip()
    log(f"Original question: {user_question}")
    log(f"Rewritten question: {rewritten_question}")
    return rewritten_question

# Augmentation and generation
def ask_question(user_question: str):
    rewritten_question = rewrite_query(user_question)
    context = vector_search(rewritten_question, os.getenv("COGNITIVESEARCHCONNECTOR5_INDEX_NAME"))

    messages = [
        SystemMessage(content="""
    You are an assistant that answers questions ONLY using the provided documents.
    Use only the text in the Context below.
    If the answer is not in the documents, respond: 'I could not find the answer in the provided documents.'
    """)
    ] + chat_history + [
        HumanMessage(content=f"Question: {rewritten_question}\n\nContext:\n{context}")
    ]

    result = llm.invoke(messages)
    answer = result.content

    # Token tracking
    token_usage = result.response_metadata.get("token_usage", {})
    log("\nTOKEN USAGE")
    log(f"Prompt tokens:     {token_usage.get('prompt_tokens', 0)}")
    log(f"Completion tokens: {token_usage.get('completion_tokens', 0)}")
    log(f"Total tokens:      {token_usage.get('total_tokens', 0)}")
  
    # Log to Arize
    arize_client.log(
    model_id="university-rag-backend",
    model_version="v1",
    prediction_id=str(uuid4()),
    prediction_label=answer,
    actual_label=None,
    features={
        "question": user_question,
        "rewritten_question": rewritten_question,
        "context": context
    },
    model_type=ModelTypes.GENERATIVE_LLM,
    environment=Environments.TRACING
)

    chat_history.append(HumanMessage(content=user_question))
    chat_history.append(AIMessage(content=answer))

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
