from flask import Flask, request, jsonify
from flask_cors import CORS
from RAG import ask_question  

app = Flask(__name__)
CORS(app)  

@app.route("/chat", methods=["POST"])
def chat_endpoint():
    try:
        data = request.get_json()

        # Front šalje:{ "chatInput": "...", "chatHistory": [...] }
        user_input = data.get("chatInput", "")

        answer = ask_question(user_input)
        print("ANSWER TYPE:", type(answer))
        print("ANSWER VALUE:", answer)
        return jsonify({"answer": answer})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="localhost", port=8000, debug=True)

