import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/authProvider.tsx";
import SocketContextProvider from "./context/socketProvider.tsx";
import MessageProvider from "./context/messageProvider.tsx";
import NotificationProvider from "./context/notificationProvider.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketContextProvider>
          <MessageProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </MessageProvider>
        </SocketContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
