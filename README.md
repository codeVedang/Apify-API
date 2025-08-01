# Integration Developer Assignment - Web App Challenge

This project is a web application that interacts with the Apify platform API. It allows a user to authenticate, select one of their actors, provide inputs based on the actor's schema, and see the results of the run.

## How to Install and Run

**Prerequisites:** You must have [Node.js](https://nodejs.org/) installed.

1.  **Clone the Repository:**
    ```bash
    git clone <your-repo-url>
    cd apify-challenge
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Run the Backend Server:**
    In the `backend` directory, run:
    ```bash
    node server.js
    ```
    The backend will be running at `http://localhost:3000`. Keep this terminal open.

4.  **Run the Frontend:**
    Open a new terminal. Navigate to the `frontend` directory and simply open the `index.html` file in your web browser. Most modern browsers can open local HTML files directly. Alternatively, you can use a simple live server extension in your code editor (like VS Code's "Live Server").

## Actor Chosen for Testing

For testing purposes, I used the **Web Scraper (`apify/web-scraper`)** actor.

* **Reasoning:** This is a powerful and common actor with a clear and relatively simple input schema. It requires a `startUrls` array, which is easy to provide as a string in a simple form. This makes it an excellent candidate for demonstrating dynamic schema loading and execution.

## Assumptions and Design Choices

* **Security:** The user's Apify API key is never stored on the frontend. It is sent to a dedicated backend proxy for each request and used immediately. This is a critical security measure.
* **Minimal Dependencies:** The frontend is built with plain HTML, CSS, and JavaScript to adhere to the assignment's requirement. The backend uses Express.js, a minimal and standard choice for Node.js APIs.
* **Dynamic Schema Generation:** The input form is generated entirely at runtime based on the JSON schema fetched from the Apify API. No actor inputs are hardcoded. The current implementation creates `<input type="text">` for all schema properties for simplicity. A more advanced version could inspect the `type` (e.g., `string`, `boolean`) and `format` properties in the schema to generate more appropriate controls (e.g., checkboxes, textareas).
* **Error Handling:** Both the frontend and backend include `try...catch` blocks to handle potential errors (e.g., invalid API key, network failures, failed actor run) and display clear feedback to the user via `alert()` or text in the results box.

## Working Flow Demonstration

1.  User lands on the page and is prompted for their Apify API Key.
   <img width="1919" height="970" alt="Screenshot 2025-08-01 195937" src="https://github.com/user-attachments/assets/ef7cbc64-0d6f-47bc-829e-3f253feb6d8f" />

2.  After entering a valid key, the app fetches and displays a dropdown list of their available actors.
    <img width="1915" height="972" alt="Screenshot 2025-08-01 200533" src="https://github.com/user-attachments/assets/c2d21066-6685-4e5a-a6b3-ce2c510c22a4" />

3.  Upon selecting an actor, the app fetches its input schema and dynamically generates a form.
    <img width="1919" height="968" alt="Screenshot 2025-08-01 202413" src="https://github.com/user-attachments/assets/a3f5e56b-ea92-4d3d-9136-d69fd80d5863" />

4.  The user fills the form and clicks "Run Actor". A loader is displayed.
    <img width="1914" height="974" alt="Screenshot 2025-08-01 203735" src="https://github.com/user-attachments/assets/18905ef1-e9c0-4ad0-8f6a-674fcc9f0bd3" />

5.  Once the actor run is complete, the results (the first page of the actor's default dataset) are displayed as a JSON object on the page.  
    <img width="493" height="960" alt="Screenshot 2025-08-01 203352" src="https://github.com/user-attachments/assets/f9cbfe16-3d0f-44da-ac53-3b8a96bc5ac9" />
