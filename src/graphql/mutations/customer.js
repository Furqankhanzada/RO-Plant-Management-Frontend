import { gql } from 'apollo-boost';

export const CREATE_CUSTOMER_MUTATION = gql`
mutation createCustomer($data: UserCreateInput!) {
                    createCustomer(data: $data){
                        name
                        id
                        mobile
                        address{
                            town
                            house
                            block
                        }
                        createdAt
                        bottle{
                            balance
                        }
                }
                }
                `;


export const UPDATE_CUSTOMER_MUTATION = gql`
mutation updateCustomer($data: UserUpdateInput!, $id:ID) {
    updateCustomer(data: $data, id:$id){
                        name
                        id
                        mobile
                        address{
                            town
                            house
                            block
                        }
                        createdAt
                        bottle{
                            balance
                        }
                }
                }
                `;