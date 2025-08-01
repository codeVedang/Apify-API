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
   
2.  After entering a valid key, the app fetches and displays a dropdown list of their available actors.
    
3.  Upon selecting an actor, the app fetches its input schema and dynamically generates a form.
    
4.  The user fills the form and clicks "Run Actor". A loader is displayed.
 
5.  Once the actor run is complete, the results (the first page of the actor's default dataset) are displayed as a JSON object on the page.
    
