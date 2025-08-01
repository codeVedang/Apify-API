// frontend/script.js
document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000/api';

    // UI Element References
    const authSection = document.getElementById('auth-section');
    const actorSelectionSection = document.getElementById('actor-selection-section');
    const schemaSection = document.getElementById('schema-section');
    const resultsSection = document.getElementById('results-section');

    const apiKeyInput = document.getElementById('apiKey');
    const authButton = document.getElementById('authButton');
    const actorSelect = document.getElementById('actorSelect');
    const inputSchemaForm = document.getElementById('inputSchemaForm');
    const runActorButton = document.getElementById('runActorButton');
    const resultsOutput = document.getElementById('resultsOutput');
    const loader = document.getElementById('loader');

    let currentApiKey = '';
    
    // --- Event Listeners ---

    authButton.addEventListener('click', handleAuthAndFetchActors);
    actorSelect.addEventListener('change', handleActorSelection);
    runActorButton.addEventListener('click', handleRunActor);

    // --- Handler Functions ---

    async function handleAuthAndFetchActors() {
        currentApiKey = apiKeyInput.value.trim();
        if (!currentApiKey) {
            alert('Please enter your Apify API key.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/list-actors`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey: currentApiKey })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch actors.');
            }

            const actors = await response.json();
            populateActorDropdown(actors);
            authSection.classList.add('hidden');
            actorSelectionSection.classList.remove('hidden');

        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    async function handleActorSelection() {
        const actorId = actorSelect.value;
        if (!actorId) {
            schemaSection.classList.add('hidden');
            resultsSection.classList.add('hidden');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/get-schema`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apiKey: currentApiKey, actorId: actorId })
            });

            if (!response.ok) throw new Error('Could not fetch schema.');

            const schema = await response.json();
            generateFormFromSchema(schema);
            schemaSection.classList.remove('hidden');

        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    async function handleRunActor() {
        const actorId = actorSelect.value;
        const formData = new FormData(inputSchemaForm);
        const inputData = {};
        
        // This simple conversion works for basic text inputs.
        // A real-world app would need to handle different types (boolean, number, etc.)
        for (let [key, value] of formData.entries()) {
            inputData[key] = value;
        }
        
        // Show loader and results section
        loader.classList.remove('hidden');
        resultsSection.classList.remove('hidden');
        resultsOutput.textContent = '';

        try {
             const response = await fetch(`${API_BASE_URL}/run-actor`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey: currentApiKey,
                    actorId: actorId,
                    inputData: inputData
                })
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.error || 'Actor run failed.');
            }

            const result = await response.json();
            resultsOutput.textContent = JSON.stringify(result, null, 2);

        } catch (error) {
            resultsOutput.textContent = `Error: ${error.message}`;
        } finally {
            loader.classList.add('hidden');
        }
    }

    // --- UI Helper Functions ---

    function populateActorDropdown(actors) {
        actorSelect.innerHTML = '<option value="">-- Please choose an actor --</option>'; // Reset
        actors.forEach(actor => {
            const option = document.createElement('option');
            option.value = actor.id;
            option.textContent = actor.name;
            actorSelect.appendChild(option);
        });
    }

    function generateFormFromSchema(schema) {
        inputSchemaForm.innerHTML = ''; // Clear previous form
        if (!schema || !schema.properties) {
            inputSchemaForm.innerHTML = '<p>This actor does not have a configurable input schema.</p>';
            return;
        }

        for (const [key, prop] of Object.entries(schema.properties)) {
            const field = document.createElement('div');
            field.className = 'form-field';

            const label = document.createElement('label');
            label.setAttribute('for', key);
            label.textContent = prop.title || key;
            if (prop.description) {
                label.textContent += ` - ${prop.description}`;
            }

            const input = document.createElement('input');
            input.id = key;
            input.name = key;
            // A more robust solution would check prop.type and create different inputs
            // (e.g., 'checkbox' for boolean, 'number' for number).
            // For this challenge, 'text' is sufficient.
            input.type = 'text';
            input.placeholder = prop.default || '';

            field.appendChild(label);
            field.appendChild(input);
            inputSchemaForm.appendChild(field);
        }
    }
});