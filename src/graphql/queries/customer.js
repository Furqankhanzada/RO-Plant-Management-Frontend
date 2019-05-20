import {gql} from "apollo-boost/lib/index";

export const GET_CUSTOMERS = gql`
    query{
        customers {
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
