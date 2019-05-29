import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { Layout, Button, Form, Input, message } from 'antd';
import { Sidebar } from './common/sidebar';
import { AppBar } from './common/header';
import { graphql } from 'react-apollo';
import { CREATE_PRODUCT_MUTATION } from '../graphql/mutations/product';
import BreadCrumbs from './BreadCrumbs';

class CreatesProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            drawer: false,
            selectedRowKeys: [],
            name: '',
            price: 0,
            disableBtn: false
        };
    }

    getValue = (ev) => {
        this.setState({
            [ev.target.name]: ev.target.value
        });
    };

    createProduct = (e) => {
        e.preventDefault();

        const { name, price } = this.state;
        const { resetFields } = this.props.form;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    disableBtn: true
                })
                const product = {
                    data: {
                        name,
                        price: parseInt(price)
                    }
                };
                this.props
                    .createProduct({
                        variables: product
                    }).then(() => {
                        this.setState({ disableBtn: false }, () => {
                            message.success('Product has been created successfully');
                            resetFields();
                        })
                    }).catch(err => {
                        this.setState({
                            disableBtn: false
                        });
                        const { graphQLErrors } = err;
                        graphQLErrors.forEach(element => {
                            message.error(element.message);
                        });
                    })
            }
        });
    };

    openDrawer = () => {
        this.setState({
            drawer: !this.state.drawer
        })
    };

    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    render() {

        const { drawer } = this.state;
        const { getFieldDecorator } = this.props.form;
        const { disableBtn } = this.state;
        const { history } = this.props;

        return (
            // <Fragment>

            //     <Layout>
            //         <AppBar handleClick={this.openDrawer} />
            //         <Layout className="dashboard-main">
            //             <Sidebar handleClick={this.handleClick} history={history} drawer={drawer} />

            //             <Layout className="remove-padding" style={{ padding: '20px 24px 0', height: '100vh' }}>
            //                 <BreadCrumbs />
                            <div className="create-main-div">
                                <div className="create-products">

                                    <Form layout="inline" onSubmit={this.handleSubmit}>
                                        <Form.Item>
                                            {getFieldDecorator('name', {
                                                rules: [{ required: true, message: 'Please input product name!' }],
                                            })(
                                                <Input
                                                    onChange={this.getValue}
                                                    name="name"
                                                    placeholder="Enter Product Name"
                                                />
                                            )}
                                        </Form.Item>
                                        <Form.Item >
                                            {getFieldDecorator('number', {
                                                rules: [{ required: true, message: 'Please input product price!' }],
                                            })(
                                                <Input
                                                    type="number"
                                                    name="price"
                                                    placeholder="Enter Price"
                                                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={value => value.replace(/\$\s?|(,*)/g)}
                                                    onChange={this.getValue}
                                                />
                                            )}
                                        </Form.Item>
                                    </Form>
                                    <Form.Item>
                                        <Button type="primary" onClick={this.createProduct} htmlType="submit" loading={disableBtn}>
                                            Create
                                                    </Button>
                                    </Form.Item>
                                </div>
                            </div>
            //             </Layout>
            //         </Layout>
            //     </Layout>
            // </Fragment>
        )
    }
}





const ProductsData = Form.create({ name: 'normal_login' })(CreatesProducts);


export default graphql(CREATE_PRODUCT_MUTATION, { name: 'createProduct' })(
    withRouter(ProductsData)
)
