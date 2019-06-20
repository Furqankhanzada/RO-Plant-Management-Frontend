import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { parse } from 'qs'
import moment from 'moment'

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
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }
  onRouteChanged() {
    const { transactionsQuery: { refetch }, location: { search } } = this.props;
    const query = parse(search);
    let where = {};
    if (query.transactionAt) {
      where.createdAt_gte = moment(query.transactionAt[0]).startOf('day');
      where.createdAt_lte = moment(query.transactionAt[1]).endOf('day');
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
    if (query.transactionAt) {
      where.createdAt_gte = moment(query.transactionAt[0]).startOf('day');
      where.createdAt_lte = moment(query.transactionAt[1]).endOf('day');
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
            const newTransaction = subscriptionData.data.transactionSubscription;
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
