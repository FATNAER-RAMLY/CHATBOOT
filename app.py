from flask import Flask, request, jsonify, render_template
import google.generativeai as genai

# Configurez la clé API directement dans le code
api_key = "AIzaSyAU7hsnGqbJbFlzCPGrpEVtUhv5JmRSFQE"  # Remplacez par votre clé API
genai.configure(api_key=api_key)

# Initialisez le modèle Gemini Pro
model = genai.GenerativeModel("gemini-pro")
chat = model.start_chat(history=[])

app = Flask(__name__)

# Route pour la page d'accueil
@app.route("/")
def home():
    return render_template("index.html")

# Route pour gérer les questions de l'utilisateur
@app.route("/ask", methods=["POST"])
def ask():
    user_input = request.json.get("question")
    if not user_input:
        return jsonify({"error": "Aucune question fournie"}), 400

    try:
        response = chat.send_message(user_input, stream=True)
        full_response = "".join(chunk.text for chunk in response)
        return jsonify({"response": full_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Démarrer l'application Flask
if __name__ == "__main__":
    app.run(debug=True)