import { gql } from 'apollo-boost';

export const CREATE_PRODUCT_MUTATION = gql`
    mutation createProduct($data: ProductCreateInput!) {
        createProduct(data: $data){
            name
        }
    }
`;
export const DELETE_PRODUCT_MUTATION = gql`
    mutation deleteProduct($where: ProductWhereUniqueInput!) {
        deleteProduct(where: $where){
            id
        }
    }
`;
export const UPDATE_PRODUCT_MUTATION = gql`
    mutation updateProduct($where: ProductWhereUniqueInput!) {
        updateProduct(where: $where, id: $id){
            id
            
        }
    }
`;