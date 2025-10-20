/**
 * Entry Point của Ứng Dụng
 * 
 * File này là điểm khởi đầu của ứng dụng React, thực hiện:
 * - Render App component vào DOM
 * - Cung cấp Redux store cho toàn bộ ứng dụng
 * - Import CSS global styles
 * 
 * Cấu trúc Provider hierarchy:
 * 1. React.StrictMode - Development mode checks
 * 2. Redux Provider - State management
 * 3. App - Main application component
 */

import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import store from "./store"
import App from "./App.jsx"
import "./styles/variables.css"  // CSS variables cho theming
import "./styles/global.css"     // Global styles
import "./index.css"             // Main styles

// Render ứng dụng vào DOM với các providers cần thiết
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Redux Provider - Cung cấp store cho toàn bộ ứng dụng */}
    <Provider store={store}>
      {/* Main App Component */}
      <App />
    </Provider>
  </React.StrictMode>,
)
