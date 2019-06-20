import { gql } from 'apollo-boost';

export const CREATE_TRANSACTION_MUTATION = gql`
mutation createTransaction($data: TransactionCreateInput!) {
    createTransaction(data: $data){
                        id
                }
                }
                `;


export const UPDATE_TRANSACTION_MUTATION = gql`
mutation updateTransaction($data: TransactionUpdateInput!, $where: TransactionWhereUniqueInput!) {
    updateTransaction(data: $data, where:$where){
        id
                }
                }
                `;
