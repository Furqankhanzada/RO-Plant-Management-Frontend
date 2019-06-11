import {gql} from "apollo-boost/lib/index";

export const GET_TRANSACTIONS = gql`
    query transactions($where: TransactionWhereInput) {
        transactions(where: $where) {
            id
            type
            status
            createdAt
            user {
                id
                name
            }
            payment {
                status
                balance
                method
                paid
            }
            items {
                product {
                    name
                }
                quantity
                discount
                total
            }
        }
    }
`;

export const TRANSACTION_SUBSCRIPTION = gql`
    subscription UserSubscription {
        userSubscription {
            id
            type
            status
            createdAt
        }
    }
`;

export const TRANSACTION_QUERY = gql`
query transactionDetail($id: ID){
    transaction(where: {id: $id}){
        id
        type
        status
        createdAt
      }
}
`;
