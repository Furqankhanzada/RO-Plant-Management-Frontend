import React, { Component, Fragment } from 'react'
import { Row, Drawer, Select } from 'antd';
import { PRODUCTS_QUERY } from '../../graphql/queries/product'
import { CUSTOMER_QUERY } from '../../graphql/queries/customer.js'
import { Query } from 'react-apollo';
import { Layout } from 'antd';
import CustomerForm from './form';

const { Option } = Select;

class CustomerDrawer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible
        }
    }

    onClose = () => {
        this.props.hideUpdateForm()
    };

    render() {
        const { history, id, visible } = this.props;
        return (
            <Row gutter={24}>
                <Drawer
                    className="new-account drawer-custom-style"
                    title={id ? 'Update Customer' : 'Create Customer'}
                    width={720}
                    onClose={this.onClose}
                    visible={visible || id}
                >
                    <Query query={PRODUCTS_QUERY}>
                        {({ data }) => {
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
                                        <Layout className="dashboard-main">
                                            <Layout className="remove-padding" style={{ padding: '30px 24px 0', height: '100vh' }}>
                                                <Query query={CUSTOMER_QUERY} variables={{ id }}
                                                    fetchPolicy="cache-and-network"
                                                    shouldInvalidatePreviousData={(nextVariables, previousVariables) =>
                                                        nextVariables.subreddit !== previousVariables.subreddit
                                                    }
                                                >
                                                    {({ data, loading }) => {
                                                        if (id && data) {
                                                            return (
                                                                <CustomerForm options={options} handledSubmit={this.submitForm} id={id ? id : false} data={data} loading={loading} history={history} closeUpdateDrawer={this.onClose} />
                                                            )
                                                        } else {
                                                            return (
                                                                <CustomerForm options={options} handledSubmit={this.submitForm} id={false} closeUpdateDrawer={this.onClose} />
                                                            )
                                                        }
                                                    }}
                                                </Query>
                                            </Layout>
                                        </Layout>
                                    </Layout>
                                </Fragment>
                            )
                        }}
                    </Query>
                </Drawer>
            </Row>
        )
    }
}

export default CustomerDrawer
