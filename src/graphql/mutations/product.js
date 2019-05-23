import { gql } from 'apollo-boost';

export const CREATE_PRODUCT_MUTATION = gql`
mutation createProduct($data: ProductCreateInput!) {
    createProduct(data: $data){
        name
    }
}
`;