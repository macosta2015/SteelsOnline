import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import HelperTextAligned from './components/form';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelperTextAligned />
    <HelperTextAligned />

  </React.StrictMode>
);


reportWebVitals();
