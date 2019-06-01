import React, { Component, Fragment } from 'react'
import moment from 'moment'
import { Button, Form, Input, Row, Icon, Col, Select } from 'antd';

const { Search } = Input;

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

    constructor(props) {
        super(props);
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
        const { filter, form: { getFieldDecorator }, id } = this.props;
        const { name, mobile } = filter;
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
                        <Button type="primary" onClick={() => this.props.showDrawerProp()}>
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
