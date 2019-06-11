import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { parse } from 'qs'

import Transaction from './transactions/index.js'


import { GET_TRANSACTIONS, TRANSACTION_SUBSCRIPTION } from '../graphql/queries/transaction'


class TransactionsPage extends Component {
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
      this.props.history.push(`/transactions/update/${params.id}`)
    }
    //const { match } = this.props;

    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    const { transactionsQuery: { refetch }, location: { search } } = this.props;
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
    this.props.subscribeToTransaction();
  }
  componentWillReceiveProps(nextProps) {
    const { error } = nextProps.transactionsQuery;
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
    const { transactions, loading } = this.props.transactionsQuery;
    return (
      <Transaction transactions={transactions} loading={loading} history={this.props.history} />
    )
  }
}

withRouter(TransactionsPage);

export default graphql(GET_TRANSACTIONS, {
  name: 'transactionsQuery', // name of the injected prop: this.props.transactionsQuery...
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
      subscribeToTransaction: params => {
        return props.transactionsQuery.subscribeToMore({
          document: TRANSACTION_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev
            }
            const newTransaction = subscriptionData.data.userSubscription;
            if (newTransaction) {
              if (prev.transactions.find(transaction => transaction.id === newTransaction.id)) {
                return prev
              }
              return Object.assign({}, prev, {
                transactions: [...prev.transactions, newTransaction]
              })
            }
            // Execute when delete item
            return Object.assign({}, prev, {
              transactions: [...prev.transactions]
            })
          }
        })
      }
    })
  }
})(TransactionsPage)
