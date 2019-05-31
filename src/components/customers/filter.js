import React, { Component, Fragment } from 'react'
import CreateCustomer from '../customers/form';
import moment from 'moment'
import { Button, Form, Input, InputNumber, Row, AutoComplete, Icon, Col, message, Spin, Drawer, Select } from 'antd';
import { PRODUCTS_QUERY } from '../../graphql/queries/product'
import { CUSTOMER_QUERY } from '../../graphql/queries/customer.js'


import { Query } from 'react-apollo';
import { Layout } from 'antd';
//import { Sidebar } from './common/sidebar'
//import { AppBar } from './common/header'
import CustomerForm from '../customers/form';

//import city from 'utils/city'
const city = [];
const { Search } = Input;
const FormItem = Form.Item;

const ColProps = {
    xs: 24,
    sm: 12,
    style: {
        marginBottom: 16
    }
};

const TwoColProps = {
    ...ColProps,
    xl: 96
};

const { Option } = Select;

class Filter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        const { id } = this.props;
        if (id) {
            this.props.hideUpdateForm()
        } else {
            this.setState({
                visible: false,
            });
        }

    };
    componentWillReceiveProps(nextProps) {
        console.log(nextProps, 'nextpppppppppppppppppppp')
    }
    componentDidUpdate(prevProps) {
        if (Object.keys(prevProps.filter).length === 0) {
            this.handleReset()
        }
    }
    handleFields = fields => {
        const { createTime = [] } = fields;
        if (createTime.length) {
            fields.createTime = [
                moment(createTime[0]).format('YYYY-MM-DD'),
                moment(createTime[1]).format('YYYY-MM-DD')
            ]
        }
        return fields
    };

    handleSubmit = () => {
        const { onFilterChange, form } = this.props;
        const { getFieldsValue } = form;

        let fields = getFieldsValue();
        fields = this.handleFields(fields);
        onFilterChange(fields)
    };

    handleReset = () => {
        const { form } = this.props;
        const { getFieldsValue, setFieldsValue } = form;

        const fields = getFieldsValue();
        for (let item in fields) {
            if ({}.hasOwnProperty.call(fields, item)) {
                if (fields[item] instanceof Array) {
                    fields[item] = []
                } else {
                    fields[item] = undefined
                }
            }
        }
        setFieldsValue(fields);
        this.handleSubmit()
    };
    handleChange = (key, values) => {
        const { form, onFilterChange } = this.props;
        const { getFieldsValue } = form;

        let fields = getFieldsValue();
        fields[key] = values;
        fields = this.handleFields(fields);
        onFilterChange(fields)
    };

    render() {
        const { filter, form: { getFieldDecorator }, history, id, tempId } = this.props;
        const { name, mobile } = filter;
        console.log(id, 'history===historyhistoryhistoryhistoryhistoryhistory')
        const FilterItem = ({ label = '', children }) => {
            const labelArray = label.split('');
            return (
                <div className='filterItem'>
                    {labelArray.length > 0 ? (
                        <div className='labelWrap '>
                            {labelArray.map((item, index) => (
                                <span className="labelText" key={index}>
                                    {item}
                                </span>
                            ))}
                        </div>
                    ) : (
                            ''
                        )}
                    <div className='item'>{children}</div>
                </div>
            )
        }
        let initialCreateTime = [];
        if (filter.createTime && filter.createTime[0]) {
            initialCreateTime[0] = moment(filter.createTime[0])
        }
        if (filter.createTime && filter.createTime[1]) {
            initialCreateTime[1] = moment(filter.createTime[1])
        }

        return (
            <Row gutter={24}>
                <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
                    {getFieldDecorator('name', { initialValue: name })(
                        <Search
                            placeholder={`Search Name`}
                            onSearch={this.handleSubmit}
                        />
                    )}
                </Col>
                <Col
                    {...ColProps}
                    xl={{ span: 5 }}
                    md={{ span: 8 }}
                    id="addressCascader"
                >
                    {getFieldDecorator('mobile', { initialValue: mobile })(
                        <Search
                            placeholder={`Search Mobile Number`}
                            onSearch={this.handleSubmit}
                        />
                    )}
                </Col>

                <Col
                    {...TwoColProps}
                    xl={{ span: 15 }}
                    md={{ span: 32 }}
                    sm={{ span: 24 }}
                >
                    <Row type="flex" align="middle" justify="space-between">
                        <div>
                            <Button
                                type="primary"
                                className="margin-right search-btn"
                                onClick={this.handleSubmit}
                            >
                                <span>Search</span>
                            </Button>
                            <Button onClick={this.handleReset}>
                                <span>Reset</span>
                            </Button>
                        </div>
                        <Button type="ghost" onClick={this.showDrawer}>
                            <span>Create</span>
                        </Button>
                    </Row>
                </Col>



                <Drawer
                    className="new-account drawer-custom-style"
                    title="Create a new account"
                    width={720}
                    onClose={this.onClose}
                    visible={this.state.visible || id}
                >
                    <Query query={PRODUCTS_QUERY}>
                        {({ data, loading }) => {
                            const { products } = data;
                            console.log(data, "data===products")
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
                                                {/* {
                                                    tempId && id ? ( */}
                                                <Query query={CUSTOMER_QUERY} variables={{ id }}
                                                    fetchPolicy="cache-and-network"
                                                    shouldInvalidatePreviousData={(nextVariables, previousVariables) =>
                                                        nextVariables.subreddit !== previousVariables.subreddit
                                                    }
                                                >
                                                    {({ data, loading }) => {
                                                        console.log(data, "====dta", id)
                                                        if (id && data) {
                                                            console.log(data, 'update-----console==============')
                                                            return (

                                                                <CustomerForm options={options} handledSubmit={this.submitForm} id={id ? id : false} data={data} loading={loading} history={history} closeUpdateDrawer={this.onClose} />
                                                            )
                                                        } else {
                                                            console.log('new-----console==============')

                                                            return (
                                                                <CustomerForm options={options} handledSubmit={this.submitForm} id={false} />

                                                            )
                                                        }
                                                        // id && data ? (
                                                        // ):(
                                                        //     <CustomerForm  options = {options} handledSubmit={this.submitForm} id={ false}/>

                                                        // )

                                                    }}

                                                </Query>
                                                {/* ) : (
                                                        <CustomerForm  options = {options} handledSubmit={this.submitForm} id={ false}/>

                                                    )
                                                } */}

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

Filter = Form.create({ name: 'customer_filter' })(Filter);


export default Filter
