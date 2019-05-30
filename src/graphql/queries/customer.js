import {gql} from "apollo-boost/lib/index";

export const GET_CUSTOMERS = gql`
    query customers($where: UserWhereInput) {
        customers(where: $where) {
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

export const CUSTOMER_SUBSCRIPTION = gql`
    subscription UserSubscription {
        userSubscription {
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

export const CUSTOMER_QUERY = gql`
query customerDetail($id:ID){
    customer(where:{id:$id}){
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
