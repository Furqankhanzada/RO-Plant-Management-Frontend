import React, { Component, Fragment } from 'react'
import { Row, Drawer, Select } from 'antd';
import { PRODUCTS_QUERY } from '../../graphql/queries/product'
import { PRODUCT_QUERY } from '../../graphql/queries/product.js'
import { Query } from 'react-apollo';
import { Layout } from 'antd';
import ProductForm from './Form';
import { client } from '../../index'
import gql from 'graphql-tag';

const { Option } = Select;

class RightDrawer extends Component {

  constructor(props) {
    super(props);
  }
  onClose() {
    client.mutate({
      mutation: gql`
          mutation openDrawer($status: Boolean!, $id: String) {
              openDrawer(status: $status, id: $id) @client {
                  Drawer
              }
          }
      `,
      variables: { status: false, id: '' }
    })
  }
  render() {
    const { id, visible } = this.props;
    return (
      <Row gutter={24}>
        <Drawer
          className="new-account drawer-custom-style"
          title={id ? 'Update Product' : 'Create Product'}
          width={720}
          onClose={this.onClose.bind(this)}
          visible={visible}
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
                        <Query query={PRODUCT_QUERY} variables={{ id }} >
                          {({ data: { product }, loading }) => {
                            return (
                                <ProductForm options={options} product={product || {}} loading={loading} />
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
        </Drawer>
      </Row>
    )
  }
}

export default RightDrawer
