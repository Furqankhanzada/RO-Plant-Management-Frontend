import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { parse } from 'qs'

import Product from './products/index.js'


import { PRODUCTS_QUERY } from '../graphql/queries/product'


class ProductsPage extends Component {
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
            this.props.history.push(`/products/update/${params.id}`)
        }
        //const { match } = this.props;

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
        // this.props.subscribeToCustomer();
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
        const { products, loading } = this.props.customersQuery;
        return (
            <Product products={products} loading={loading} history={this.props.history} />
        )
    }
}

withRouter(ProductsPage);

export default graphql(PRODUCTS_QUERY, {
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
    }
})(ProductsPage)
