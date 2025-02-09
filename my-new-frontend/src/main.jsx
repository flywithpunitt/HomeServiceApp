import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Import createRoot from React 18+
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import './index.css';


const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ Use createRoot()
root.render(
  <GoogleOAuthProvider clientId="191631300531-t18o0gf86gvqd6fe1hcbc7nrhe4cihs7.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
