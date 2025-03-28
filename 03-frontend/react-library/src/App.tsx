import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { HomePage } from './layouts/HomePage/HomePage';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import oktaConfig from './lib/OktaConfig';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, SecureRoute, Security } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';
import { ReviewListPage } from './layouts/BookCheckoutPage/ReviewListPage';
import { ShelfPage } from './layouts/ShelfPage/ShelfPage';
import { MessagesPage } from './layouts/MessagesPage/MessagesPage';
import { ManageLibraryPage } from './layouts/ManageLibraryPage/ManageLibraryPage';
import { PaymentPage } from './layouts/PaymentPage/PaymentPage';

const oktaAuth = new OktaAuth(oktaConfig);

export const App = () => {
    const customAuthHandler = () => {
        history.push('/login');
    };

    const history = useHistory();

    const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
        history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Security
                oktaAuth={oktaAuth}
                restoreOriginalUri={restoreOriginalUri}
                onAuthRequired={customAuthHandler}
            >
                <Navbar />
                <div className="flex-grow-1">
                    <Switch>
                        <Route path="/" exact>
                            <Redirect to="/home" />
                        </Route>
                        <Route path="/home">
                            <HomePage />
                        </Route>
                        <Route path="/search">
                            <SearchBooksPage />
                        </Route>
                        <Route path="/checkout/:bookId">
                            <BookCheckoutPage />
                        </Route>
                        <Route path="/reviewlist/:bookId">
                            <ReviewListPage />
                        </Route>
                        <SecureRoute path="/shelf">
                            <ShelfPage />
                        </SecureRoute>
                        <SecureRoute path="/messages">
                            <MessagesPage />
                        </SecureRoute>
                        <SecureRoute path="/admin">
                            <ManageLibraryPage />
                        </SecureRoute>
                        <SecureRoute path="/fees">
                            <PaymentPage />
                        </SecureRoute>
                        <Route path="/login" render={() => <LoginWidget config={oktaConfig} />} />
                        <Route path="/login/callback" component={LoginCallback} />
                    </Switch>
                </div>
                <Footer />
            </Security>
        </div>
    );
};

export default App;
