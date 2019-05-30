import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom'
import { Layout, AutoComplete } from 'antd';
import { Sidebar } from './common/sidebar'
import { AppBar } from './common/header'
import { Query } from 'react-apollo';
import CustomerForm from './customers/form';
import { PRODUCTS_QUERY } from '../graphql/queries/product'

const Option = AutoComplete.Option;


class CreateCustomer extends Component {
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
        const { drawer } = this.state;
        const { history, match, data } = this.props;
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
                                        <Sidebar handleClick={this.handleClick} history={history} drawer={drawer} />

                                        <Layout className="remove-padding" style={{ padding: '30px 24px 0', height: '100vh' }}>
                                            <CustomerForm  options = {options} handledSubmit={this.submitForm} id={id ? id : false}/>
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


withRouter(CreateCustomer);

export default CreateCustomer

