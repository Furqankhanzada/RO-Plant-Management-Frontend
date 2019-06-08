import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-boost';
import gql from "graphql-tag"

export const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql"
})

const cache = new InMemoryCache();

const defaults = {
    Drawer: {
        open: false,
        id: '',
        __typename: "Drawer"
    }
}

export const GET_DRAWER_STATUS = gql`
{
    Drawer @client {
        open
        id
    }
}
`;

const resolvers = {
    Mutation: {
        openDrawer: (_, { status, id }, { cache }) => {
            const updatedStatus = { open: status,id, __typename: "Drawer" };
            const data = {Drawer: updatedStatus, __typename: "Drawer"}
            cache.writeData({data})
            return data
        }
    }
}

export const stateLink = withClientState({
    cache,
    defaults,
    resolvers
})

const client = new ApolloClient({
    link: ApolloLink.from([stateLink, httpLink]),
    cache
})

export default client;