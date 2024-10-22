const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static HTML file

app.post('/ask', async (req, res) => {
    const userInput = req.body.question;
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        prompt: userInput,
        max_tokens: 100
    }, {
        headers: {
            'Authorization': `Bearer YOUR_API_KEY`,
            'Content-Type': 'application/json'
        }
    });

    res.json({ answer: response.data.choices[0].message });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
