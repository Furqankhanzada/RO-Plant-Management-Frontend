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
        const { productsQuery: { refetch }, location: { search } } = this.props;
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
        // this.props.subscribeToProducts();
    }
    componentWillReceiveProps(nextProps) {
        const { error } = nextProps.productsQuery;
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
        const { products, loading } = this.props.productsQuery;
        return (
            <Product products={products} loading={loading} history={this.props.history} />
        )
    }
}

withRouter(ProductsPage);

export default graphql(PRODUCTS_QUERY, {
    name: 'productsQuery', // name of the injected prop: this.props.productsQuery...
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
