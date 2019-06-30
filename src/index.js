import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {stateLink} from './client';


import { HttpLink, InMemoryCache, ApolloClient } from 'apollo-client-preset'
import { WebSocketLink } from 'apollo-link-ws'
import { ApolloLink, split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import { AUTH_TOKEN } from './constant'
import { ApolloProvider } from 'react-apollo'
import RootContainer from './components/RootContainer';

import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'
import './index.css'

const httpLink = new HttpLink({ uri: 'https://ro-server.financebakerz.com' });

const middlewareLink = new ApolloLink((operation, forward) => {
    // get the authentication token from local storage if it exists
    const tokenValue = localStorage.getItem(AUTH_TOKEN);
    // return the headers to the context so httpLink can read them
    operation.setContext({
        headers: {
            Authorization: tokenValue ? `Bearer ${tokenValue}` : ''
        }
    });
    return forward(operation)
});

// authenticated httplink
const httpLinkAuth = middlewareLink.concat(httpLink);

const wsLink = new WebSocketLink({
    uri: `wss://ro-server.financebakerz.com/`,
    options: {
        reconnect: true,
        connectionParams: {
            Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`
        }
    }
});

const link = split(
    // split based on operation type
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLinkAuth
);

// apollo client setup
export const client = new ApolloClient({
    link: ApolloLink.from([stateLink, link]),
    cache: new InMemoryCache(),
    connectToDevTools: true
});

const token = localStorage.getItem(AUTH_TOKEN);

ReactDOM.render(
    <ApolloProvider client={client}>
        <RootContainer token={token} />
    </ApolloProvider>,
    document.getElementById('root')
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
