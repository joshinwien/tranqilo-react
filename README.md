# tranqilo-react 🧘‍♂️

This repository contains the React Single Page Application (SPA) frontend for the **tranqilo** health recovery app. It communicates with the corresponding Spring Boot backend to provide a modern, interactive user experience.

**Backend Repository:** [joshinwien/tranqilo-backend](https://github.com/joshinwien/tranqilo-backend)

---

## Features (Planned)

-   **JWT Authentication:** Secure login for clients and coaches.
-   **Role-Based Dashboards:** Separate, tailored views for clients and coaches.
-   **Real-time Messaging:** A dedicated inbox and conversation view for direct communication.
-   **Client Check-Ins:** A form for clients to log their daily recovery metrics.

---

## Tech Stack

-   **Framework:** [React](https://reactjs.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Styling:** Plain CSS / CSS Modules (can be extended with a UI library later)
-   **API Client:** [Axios](https://axios-http.com/)
-   **Routing:** [React Router](https://reactrouter.com/)

---

## Getting Started

Follow these instructions to get the project running on your local machine for development and testing purposes.

### Prerequisites

You will need [Node.js](https://nodejs.org/) (version 20.x or higher) and `npm` installed on your machine.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/joshinwien/tranqilo-react.git](https://github.com/joshinwien/tranqilo-react.git)
    cd tranqilo-react
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Create a local environment file:**
    Create a file named `.env.local` in the root of the project. This file will hold your local environment variables.

4.  **Configure the API URL:**
    Add the following line to your `.env.local` file. This tells the React app where to find your backend API.
    ```
    VITE_API_BASE_URL=http://localhost:8080
    ```

### Running the Application

To start the local development server, run the following command:

```bash
npm run dev
