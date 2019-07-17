import React, { Component } from 'react'
import moment from 'moment'
import {Button, Form, Input, Row, Icon, Col, Select} from 'antd';
import { client } from '../../index'
import gql from 'graphql-tag';

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

    openDrawer(){
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
        return (
            <Row gutter={24}>
                <Col
                    {...TwoColProps}
                    xl={{ span: 24 }}
                    md={{ span: 24 }}
                    sm={{ span: 24 }}
                >
                    <Row className="btn-right" type="flex" align="middle">
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

Filter = Form.create({ name: 'product_filter' })(Filter);


export default Filter
