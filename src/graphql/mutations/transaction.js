import { gql } from 'apollo-boost';

export const CREATE_TRANSACTION_MUTATION = gql`
mutation createTransaction($data: TransactionCreateInput!) {
    createTransaction(data: $data){
                        id
                }
                }
                `;


export const UPDATE_TRANSACTION_MUTATION = gql`
mutation updateTransaction($data: TransactionUpdateInput!, $id:ID) {
    updateTransaction(data: $data, id:$id){
        id
                }
                }
                `;
