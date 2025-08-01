// backend/server.js

const express = require('express');
const { ApifyClient } = require('apify-client');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Allow requests from our frontend
app.use(bodyParser.json()); // Parse JSON request bodies

// --- API ENDPOINTS ---

// 1. Endpoint to list actors
app.post('/api/list-actors', async (req, res) => {
    try {
        const { apiKey } = req.body;
        if (!apiKey) {
            return res.status(400).json({ error: 'API key is required.' });
        }
        const client = new ApifyClient({ token: apiKey });
        const actors = await client.actors().list();
        res.json(actors.items);
    } catch (error) {
        console.error('Error fetching actors:', error);
        res.status(500).json({ error: 'Failed to fetch actors. Is your API key valid?' });
    }
});

// 2. Endpoint to get a specific actor's schema
app.post('/api/get-schema', async (req, res) => {
    try {
        const { apiKey, actorId } = req.body;
        if (!apiKey || !actorId) {
            return res.status(400).json({ error: 'API key and Actor ID are required.' });
        }
        const client = new ApifyClient({ token: apiKey });
        const actor = await client.actor(actorId).get();
        res.json(actor.inputSchema);
    } catch (error) {
        console.error('Error fetching schema:', error);
        res.status(500).json({ error: 'Failed to fetch actor schema.' });
    }
});

// 3. Endpoint to run an actor and get its result
app.post('/api/run-actor', async (req, res) => {
    try {
        const { apiKey, actorId, inputData } = req.body;
        if (!apiKey || !actorId || !inputData) {
            return res.status(400).json({ error: 'API key, Actor ID, and input data are required.' });
        }

        const client = new ApifyClient({ token: apiKey });
        const actorCall = await client.actor(actorId).call(inputData);

        // Fetch the results from the run's default dataset
        const { items } = await client.dataset(actorCall.defaultDatasetId).listItems();
        
        res.json(items);

    } catch (error) {
        console.error('Error running actor:', error);
        res.status(500).json({ error: 'Failed to execute actor run.' });
    }
});


app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});