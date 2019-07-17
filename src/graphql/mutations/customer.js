import { gql } from 'apollo-boost';

export const CREATE_CUSTOMER_MUTATION = gql`
    mutation createCustomer($data: UserCreateInput!) {
        createCustomer(data: $data){
            name
            id
            mobile
            bottleBalance
            address{
                town
                house
                block
            }
            createdAt

        }
    }
`;


export const UPDATE_CUSTOMER_MUTATION = gql`
    mutation updateCustomer($data: UserUpdateInput!, $id:ID) {
        updateCustomer(data: $data, id: $id){
            name
            mobile
            bottleBalance
            address{
                town
                area
                block
                house
            }
            discounts{
                id
                product{
                    id
                    price
                    name
                }
                discount
            }
        }
    }
`;
