import { gql } from 'apollo-boost';

export const CREATE_TRANSACTION_MUTATION = gql`
    mutation createTransaction($data: TransactionCreateInput!, $bottleBalance: Int) {
        createTransaction(data: $data, bottleBalance: $bottleBalance){
            id
        }
    }
`;


export const UPDATE_TRANSACTION_MUTATION = gql`
    mutation updateTransaction($data: TransactionUpdateInput!, $where: TransactionWhereUniqueInput!, $userID: ID,  $bottleBalance: Int, $edit: Boolean) {
        updateTransaction(data: $data, where:$where, userID: $userID,  bottleBalance: $bottleBalance, edit: $edit){
            id
        }
    }
`;
