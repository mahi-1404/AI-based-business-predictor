import os
import google.generativeai as genai
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

# Configure the Gemini API key
# IMPORTANT: Create a .env file in the same directory as app.py
# and add your Google AI API key like this:
# GOOGLE_API_KEY="YOUR_API_KEY"
try:
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
except AttributeError:
    print("ERROR: The GOOGLE_API_KEY environment variable is not set.")
    print("Please create a .env file and add your API key.")
    exit()


# Create a new Gemini model
model = genai.GenerativeModel('gemini-pro')
chat = model.start_chat(history=[])


# Initialize Flask app
app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/trends.html')
def trends():
    return render_template('trends.html')

@app.route('/simulator.html')
def simulator():
    return render_template('simulator.html')

@app.route('/map.html')
def map():
    return render_template('map.html')

@app.route('/page2.html')
def page2():
    return render_template('page2.html')

@app.route('/api/chat', methods=['POST'])
def chat_route():
    """
    Handles chat requests from the frontend.
    Receives a message from the user, sends it to the Gemini model,
    and returns the model's response.
    """
    try:
        data = request.get_json()
        user_message = data.get("message")

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        # Send the message to the chat session
        response = chat.send_message(user_message)

        # Return the AI's response
        return jsonify({"reply": response.text})

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "Failed to process the request"}), 500

if __name__ == '__main__':
    # Runs the Flask app on port 5000
    app.run(debug=True, port=5000)
