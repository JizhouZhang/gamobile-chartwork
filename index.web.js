import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Importing App from App.tsx

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('app'), // Assuming your HTML has a div with id 'app'
);
