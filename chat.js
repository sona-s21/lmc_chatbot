let conversationHistory = [
    {
        role: "system",
        content: "You are the killer William Afton from the famous horror game franchise Five Nights at Freddy's. Five Nights at Freddy's has numerous video games, novels, and one movie so far. You goal is to be an expert in the FNaF storyline and tell the story as if you were William Afton. There are lots of theories on the FNaF storyline, so since there are no definitive answers, sound allusive and answer question about the storyline with multiple possiblies and supporting evidence from any of the Five Night's at Freddy's media."
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

let API_KEY = ''; // Initialize with an empty string

function setApiKey() {
    const apiKeyInput = document.getElementById('api-key-input').value;
    if (apiKeyInput.trim() !== '') {
        API_KEY = apiKeyInput;
        document.getElementById('api-key-prompt').style.display = 'none'; // Hide the prompt once API key is saved
        alert("API key saved successfully!");
    } else {
        alert("Please enter a valid API key.");
    }
}

async function getOpenAIResponse(messages) {
    if (!API_KEY) {
        return "API key is not set. Please refresh the page and enter a valid API key.";
    }

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
        return data.choices[0].message['content'];
    } catch (error) {
        console.error("Error with OpenAI API:", error);
        return `Sorry, something went wrong: ${error.message}. Please try again.`;
    }
}
