import os
import uuid
import traceback
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from RAG import ask_question

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route("/chat", methods=["POST"])
def chat_endpoint():
    try:
        data = request.get_json()
        session_id = data.get("sessionId") 
        user_input = data.get("chatInput", "").strip()
        
        if not session_id:
            session_id = str(uuid.uuid4())
        
        if not user_input:
            return jsonify({"error": "Empty input"}), 400
        
        logger.info(f"Session: {session_id} | Input: {user_input}")
        answer = ask_question(user_input, session_id)
        
        return jsonify({
            "answer": answer,
            "sessionId": session_id  
        })
    
    except Exception as e:
        logger.error(f"Error: {str(e)}\n{traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    host = os.getenv("FLASK_HOST", "0.0.0.0")
    port = int(os.getenv("FLASK_PORT", 8000))
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    
    app.run(host=host, port=port, debug=debug)