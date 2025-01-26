document.getElementById("send-btn").addEventListener("click", async () => {
    const userInput = document.getElementById("user-input").value;
    if (!userInput) return;

    // Ajouter la question de l'utilisateur à l'historique du chat
    addMessageToChat("You", userInput);

    // Envoyer la question au backend Flask
    try {
        const response = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question: userInput }),
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }

        // Ajouter la réponse du bot à l'historique du chat
        addMessageToChat("Bot", data.response);
    } catch (error) {
        console.error("Erreur :", error);
        addMessageToChat("Bot", "Une erreur s'est produite. Veuillez réessayer.");
    }

    // Effacer le champ de saisie
    document.getElementById("user-input").value = "";
});

function addMessageToChat(role, message) {
    const chatHistory = document.getElementById("chat-history");
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", role.toLowerCase());
    messageElement.innerHTML = `<strong>${role}:</strong> ${message}`;
    chatHistory.appendChild(messageElement);

    // Faire défiler vers le bas pour voir le dernier message
    chatHistory.scrollTop = chatHistory.scrollHeight;
}