import React, { Component } from 'react'
import moment from 'moment'
import {Button, Form, Input, Row, Icon, Col, DatePicker, Select } from 'antd';
import { client } from '../../index'
import gql from 'graphql-tag';

const { Option, type } = Select;
const { Search } = Input;
const { MonthPicker, RangePicker } = DatePicker;

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

class Filter extends Component {
    componentDidUpdate(prevProps) {
        if (Object.keys(prevProps.filter).length === 0) {
            this.handleReset()
        }
    }
    handleFields = fields => {
        const { transactionAt } = fields;
        if (transactionAt.length) {
            fields.transactionAt = [
                moment(transactionAt[0]).format('YYYY-MM-DD'),
                moment(transactionAt[1]).format('YYYY-MM-DD')
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

    openDrawer = () => {
        client.mutate({
            mutation: gql`
            mutation openDrawer($status: Boolean!, $id: String) {
                openDrawer(status: $status, id: $id) @client {
                    Drawer
                }
            }
            `,
            variables: { status: true, id: '' }
        })
    }
    render() {
        const { filter, form: { getFieldDecorator } } = this.props;
        let { type = "", status = "", payment = "" } = filter;
        let initialtransactionAt = [];
        if (filter.transactionAt && filter.transactionAt[0]) {
            initialtransactionAt[0] = moment(filter.transactionAt[0])
        }
        if (filter.transactionAt && filter.transactionAt[1]) {
            initialtransactionAt[1] = moment(filter.transactionAt[1])
        }

        return (
            <Row gutter={24}>
                <Col className="transactions-box" {...ColProps} xl={{ span: 4 }} lg={{ span: 12 }} sm={{ span: 8 }} md={{ span: 8 }}>
                    <span className="transactions-label">Type</span>
                    {getFieldDecorator('type', { initialValue: type })(
                        <Select
                            onChange={this.handleChange.bind(this, 'type' )}
                            className="type-field" >
                            <Option value="">None</Option>
                            <Option value="SELL">SELL</Option>
                            <Option value="PURCHASE">PURCHASE</Option>
                        </Select>
                    )}
                </Col>
                <Col className="transactions-box" {...ColProps} xl={{ span: 4 }} lg={{ span: 12 }} sm={{ span: 8 }} md={{ span: 8 }}>
                    <span className="transactions-label">Status</span>
                    {getFieldDecorator('status', { initialValue: status })(
                        <Select
                            onChange={this.handleChange.bind(this, 'status' )}
                            className="type-field" >
                            <Option value="">None</Option>
                            <Option value="PENDING">PENDING</Option>
                            <Option value="PROCESSING">PROCESSING</Option>
                            <Option value="COMPLETED">COMPLETED</Option>
                        </Select>
                    )}
                </Col>
                <Col className="transactions-box" {...ColProps} xl={{ span: 4 }} lg={{ span: 8 }} sm={{ span: 8 }} md={{ span: 8 }}>
                    <span className="transactions-label">Payment</span>
                    {getFieldDecorator('payment', { initialValue: payment })(
                        <Select
                            onChange={this.handleChange.bind(this, 'payment' )}
                            className="type-field" >
                            <Option value="">None</Option>
                            <Option value="PAID">PAID</Option>
                            <Option value="UNPAID">UNPAID</Option>
                        </Select>
                    )}
                </Col>
                <Col className="transactions-box" {...ColProps} xl={{ span: 12 }} lg={{ span: 16 }} sm={{ span: 24 }} md={{ span: 24 }}>
                    <span className="transactions-label">Transaction</span>
                    {getFieldDecorator('transactionAt', {
                        initialValue: initialtransactionAt,})(
                    < RangePicker onChange={this.handleChange.bind(this, 'transactionAt')} className="range-picker"/>
                    )}
                </Col>

                <Col{...TwoColProps} xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }}>
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
                        <Button type="primary" onClick={this.openDrawer}>
                            <Icon type="plus" />
                            <span>Create</span>
                        </Button>
                    </Row>
                </Col>
            </Row>
        )
    }
}

Filter = Form.create({ name: 'customer_filter' })(Filter);


export default Filter
