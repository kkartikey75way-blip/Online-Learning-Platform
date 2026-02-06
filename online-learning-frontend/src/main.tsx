import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { router } from "./router";
import { store } from "./store/store";
import "./index.css";
import AuthInitializer from "./components/AuthInitializer";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <AuthInitializer>
          <RouterProvider router={router} />
        </AuthInitializer>
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);
