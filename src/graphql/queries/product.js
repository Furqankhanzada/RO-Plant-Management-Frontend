import { gql } from 'apollo-boost';

export const PRODUCTS_QUERY = gql`
    query ProductQuery {
        products {
            id
            name
            price
        }
    }
`;