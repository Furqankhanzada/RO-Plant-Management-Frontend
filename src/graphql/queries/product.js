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
export const PRODUCT_QUERY = gql`
    query productDetail($id: ID){
        product(where:{id: $id}) {
            id
            name
            price
            
        }
    }
`;