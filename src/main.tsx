import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_API_CLIENT_ID}>
      <App history={history} />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
