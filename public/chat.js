async function sendMessage() {
    const input = document.getElementById('user-input').value;

    const response = await fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input })
    });

    const result = await response.json();
    document.getElementById('chat-box').innerHTML += `<p><b>You:</b> ${input}</p><p><b>Bot:</b> ${result.answer}</p>`;
    document.getElementById('user-input').value = ''; // Clear input
}
