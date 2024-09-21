import React, { useState } from 'react'; // Make sure useState is imported
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import EmailList from './components/email/email.js';
import DeleteEmail from './components/email/deleteemail.js';
import App from './App.js'

const root = ReactDOM.createRoot(document.getElementById('root'));
function Main() {
  const [emailList, setEmailList] = useState([]);

  return (
    <>
      <App />
      <EmailList emailList={emailList} setEmailList={setEmailList} />
      <DeleteEmail emailList={emailList} setEmailList={setEmailList} />
    </>
  );
}

root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
// root.render(
//   <React.StrictMode>
//     <App />
//     <EmailList />
//     <DeleteEmail />
//   </React.StrictMode>
// );


reportWebVitals();
