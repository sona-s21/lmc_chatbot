// Initialize an array to store the conversation history
let conversationHistory = [
    {
        role: "system",
        content: "You are an expert in all slasher horror movies. You can help anyone answer questions about horror movie franchises such as Scream, Halloween, Friday the 13th, Nightmare on Elm Street, Chucky, Saw, Ring, and Texas Chainsaw Massacre. You will relay your answers in a spooky or gruesome way to fit the atmosphere of the questions."
    }
];

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;

    if (userInput.trim() === "") {
        return; // Do nothing if input is empty
    }

    // Add user input to the conversation history
    conversationHistory.push({ role: "user", content: userInput });

    displayMessage("You", userInput);
    document.getElementById('user-input').value = ""; // Clear the input box

    // Call OpenAI API and pass the entire conversation history
    const response = await getOpenAIResponse(conversationHistory);
    
    // Add chatbot response to the conversation history
    conversationHistory.push({ role: "assistant", content: response });

    displayMessage("Chatbot", response);
}

// Function to display messages in the chatbox
function displayMessage(sender, message) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message');
    
    const senderElement = document.createElement('strong');
    senderElement.textContent = sender + ": ";

    const messageElement = document.createElement('span');
    messageElement.textContent = message;

    messageContainer.appendChild(senderElement);
    messageContainer.appendChild(messageElement);

    document.getElementById('messages').appendChild(messageContainer);
}

// Function to call OpenAI's API using fetch
async function getOpenAIResponse(messages) {
    const API_KEY = 'insert API Key here'; // Replace with your actual API key
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const body = {
        model: "gpt-3.5-turbo", // Change to "gpt-4" if desired
        messages: messages, // Send conversation history
        temperature: 1,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    };

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error details:", errorData);
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Error with OpenAI API:", error);
        return `Sorry, something went wrong: ${error.message}. Please try again.`;
    }
}
