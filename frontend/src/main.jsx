import './index.css'
import React from 'react'
import { StrictMode } from 'react'
import { BrowserRouter } from "react-router-dom";
import queryClient from "./http/queryClient";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from 'react-dom/client'
import App from './App.jsx'



createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
