import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import HelperTextAligned from './components/form';
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <HelperTextAligned /> */}
    <App />
  </React.StrictMode>
);


reportWebVitals();
