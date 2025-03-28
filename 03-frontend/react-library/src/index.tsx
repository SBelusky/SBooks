import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
    'pk_test_51QYMmjRoHPC8LwRa6lto8OKhMxUqTyfonJeuicq0ytQ9iCw1lHZFtY7vqgLEnVlwwtlvJZ4ZYyQwAHf5oNXsu0TV00jyyLfXPB'
);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <BrowserRouter>
        <Elements stripe={stripePromise}>
            <App />
        </Elements>
    </BrowserRouter>
);
