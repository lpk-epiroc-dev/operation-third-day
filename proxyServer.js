// proxyServer.js

const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

const GITHUB_TOKEN = 'your-github-token';  // Replace with your GitHub personal access token
const owner = 'your-username';
const repo = 'your-repo';
const path = 'data/formData.json';
const branch = 'main';

app.use(bodyParser.json());

app.post('/api/sync', async (req, res) => {
    const content = Buffer.from(JSON.stringify(req.body)).toString('base64');

    try {
        // Check if the file already exists
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
        
        let response = await fetch(url, {
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        let result = await response.json();

        let dataToSend = {
            message: 'Update form data',
            content: content,
            branch: branch
        };

        if (response.ok) {
            // If file exists, include the SHA of the file in the request
            dataToSend.sha = result.sha;
        }

        // Send the data to GitHub
        let updateResponse = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        });

        if (updateResponse.ok) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Error updating file', details: await updateResponse.json() });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error syncing data', details: error });
    }
});

app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});
