import {gql} from "apollo-boost/lib/index";

export const GET_TRANSACTIONS = gql`
    query transactions($where: UserWhereInput) {
        transactions(where: $where) {
            name
            id
            mobile
            address{
                town
                house
                block
                area
            }
            createdAt
            bottle{
                balance
            }
        }
    }
`;

export const TRANSACTION_SUBSCRIPTION = gql`
    subscription UserSubscription {
        userSubscription {
            name
            id
            mobile
            address{
                town
                house
                block
                area
            }
            createdAt
            bottle{
                balance
            }
        }
    }
`;

export const TRANSACTION_QUERY = gql`
query transactionDetail($id:ID){
    transaction(where:{id:$id}){
        name
        mobile
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
