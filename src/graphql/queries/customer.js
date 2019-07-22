import {gql} from "apollo-boost/lib/index";

export const GET_CUSTOMERS = gql`
    query customers($where: UserWhereInput, $first: Int) {
        customers(where: $where, first: $first) {
            name
            id
            mobile
            address{
                id
                town
                house
                block
                area
            }
            createdAt
            bottleBalance
            discounts{
                product{
                    id
                    price
                    name
                }
                discount
                id
            }
        }
    }
`;

export const CUSTOMER_SUBSCRIPTION = gql`
    subscription UserSubscription {
        userSubscription {
            id
            name
            mobile
            address{
                id
                town
                area
                block
                house
                id
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

export const CUSTOMER_QUERY = gql`
    query customerDetail($id: ID){
        customer(where:{id: $id}) {
            id
            name
            mobile
            bottleBalance
            address{
                town
                area
                block
                house
                id
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
export const ME = gql`
    query MeQuery {
        me {
            id
            mobile
            name
        }
    }
`;
