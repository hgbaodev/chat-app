import { createRoot } from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import reportWebVitals from "~/reportWebVitals";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <GoogleOAuthProvider clientId="387483545489-muknqkprotf0b41nlgai6msu2dqf8ftt.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);

reportWebVitals();
