import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import UserProvider from './Context/UserProvider';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <UserProvider>

        <App />
        </UserProvider>

    </BrowserRouter>);

