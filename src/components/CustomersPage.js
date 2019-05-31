import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { parse } from 'qs'

import Customer from './customers/index.js'


import { GET_CUSTOMERS, CUSTOMER_SUBSCRIPTION } from '../graphql/queries/customer'


class CustomersPage extends Component {
  constructor(props){
    super(props);
    this.state = {
      current: 'mail',
      drawer: false,
      id: ''
    }
  }
  componentDidUpdate(prevProps) {
    const { match } = this.props;
    const {params} = match;
    if(params.id){
      this.props.history.push(`/customers/update/${params.id}`)
    }
    //const { match } = this.props;

    console.log(prevProps,"prev====", this.props)
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    const { customersQuery: { refetch }, location: { search } } = this.props;
    const query = parse(search);
    let where = {};
    if (query.name) {
      where.name_contains = query.name
    }
    if (query.mobile) {
      where.mobile_contains = query.mobile
    }
    refetch({
      where
    })
  }
  componentDidMount() {
    this.props.subscribeToCustomer();
  }
  componentWillReceiveProps(nextProps) {
    const { error } = nextProps.customersQuery;
    if (error) {
      const { graphQLErrors } = error;
      graphQLErrors.forEach((value) => {
        if (value.message === 'Not Authorised!') {
          localStorage.removeItem('AUTH_TOKEN');
          window.location.reload()
        }
      })
    }
  }

  handleClick = (e) => {
    this.setState({
      current: e.key
    })
  };

  openDrawer = () => {
    this.setState({
      drawer: !this.state.drawer
    })
  };

  render() {
    const { customers, loading } = this.props.customersQuery;
    return (
      <Customer customers={customers} loading={loading} history={this.props.history} />
    )
  }
}

withRouter(CustomersPage);

export default graphql(GET_CUSTOMERS, {
  name: 'customersQuery', // name of the injected prop: this.props.customersQuery...
  options: ({ location: { search = {} } }) => {
    const query = parse(search);
    let where = {};
    if (query.name) {
      where.name_contains = query.name
    }
    if (query.mobile) {
      where.mobile_contains = query.mobile
    }
    return {
      variables: {
        where
      }
    }
  },
  props: props => {
    return Object.assign({}, props, {
      subscribeToCustomer: params => {
        return props.customersQuery.subscribeToMore({
          document: CUSTOMER_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev
            }
            const newCustomer = subscriptionData.data.userSubscription;
            if (newCustomer) {
              if (prev.customers.find(customer => customer.id === newCustomer.id)) {
                return prev
              }
              return Object.assign({}, prev, {
                customers: [...prev.customers, newCustomer]
              })
            }
            // Execute when delete item
            return Object.assign({}, prev, {
              customers: [...prev.customers]
            })
          }
        })
      }
    })
  }
})(CustomersPage)
