import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';


// Create a root for rendering React components into the DOM.
ReactDOM.createRoot(document.getElementById('root')).render(
  // Enable strict mode for additional runtime checks and warnings.
  <React.StrictMode>
    {/* Render the main App component. */}
    <App />
  </React.StrictMode>,
);