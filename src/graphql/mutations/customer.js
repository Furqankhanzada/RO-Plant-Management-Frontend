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