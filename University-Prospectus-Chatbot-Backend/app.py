from flask import Flask, request, jsonify
from flask_cors import CORS
from RAG import ask_question  

app = Flask(__name__)
CORS(app)  

@app.route("/chat", methods=["POST"])
def chat_endpoint():
    try:
        data = request.get_json()
        user_input = data.get("chatInput", "")
        answer = ask_question(user_input)
        return jsonify({"answer": answer})
    except Exception as e:
        import traceback
        print(traceback.format_exc())  # ovo ispisuje full error u Docker logovima
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)

