import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom'
import { Layout, AutoComplete } from 'antd';
import { Sidebar } from './common/sidebar'
import { AppBar } from './common/header'
import { Query } from 'react-apollo';
import CustomerForm from './customers/form'
import { graphql } from 'react-apollo'
import { CUSTOMER_QUERY } from '../graphql/queries/customer'
import { PRODUCTS_QUERY } from '../graphql/queries/product'

const Option = AutoComplete.Option;


class UpdateCustomer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            products: [],
            result: [],
            drawer: false,
            disableBtn: false,
            selectedValue: ''
        }
    }

    remove = k => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }
        form.setFieldsValue({
            keys: keys.filter(key => key !== k)
        });
    };



    openDrawer = () => {
        this.setState({
            drawer: !this.state.drawer
        })
    };


    render() {
        const { history, match } = this.props;
        const { params } = match;
        const { id } = params;
        return (
            <Query query={PRODUCTS_QUERY}>
                {({ data, loading }) => {
                    const { products } = data;
                    const options = products ? products
                        .map(group => (
                            <Option key={group} value={JSON.stringify(group)}>
                                <span>Volume: {group.name}</span>
                                <br />
                                <span>Price: {group.price}</span>
                            </Option>
                        )) : [];
                    return (
                        <Fragment>

                            <Layout>
                                <AppBar handleClick={this.openDrawer} />
                                <Layout className="dashboard-main">
                                    <Sidebar handleClick={this.handleClick} history={history} />

                                    <Layout className="remove-padding" style={{ padding: '30px 24px 0', height: '100vh' }}>
                                        <Query query={CUSTOMER_QUERY} variables={{ id }}>
                                            {({ data, loading }) => {
                                                return (
                                                    <CustomerForm options={options} handledSubmit={this.submitForm} id={id ? id : false} data={data} loading={ loading }/>
                                                )
                                            }}

                                        </Query>

                                    </Layout>
                                </Layout>
                            </Layout>
                        </Fragment>
                    )
                }}
            </Query>

        )
    }
}





export default graphql(CUSTOMER_QUERY, { name: 'customerDetail' })(
    withRouter(UpdateCustomer)
)