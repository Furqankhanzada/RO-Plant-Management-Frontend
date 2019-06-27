import React, { Component, Fragment } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Row, Col, Card, Icon } from 'antd';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <Fragment>
                <div className="dashboard">
                    <Row gutter={16}>
                        <Col className="" xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                            <Card style={{ width: '100%' }}>
                                <Icon className="review-icon" type="pay-circle" />
                                <div className="dashboard-details">
                                    <h5>Online Review</h5>
                                    <h3>2,781</h3>
                                </div>
                            </Card>
                        </Col>
                        <Col className="" xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                            <Card style={{ width: '100%' }}>
                                <Icon className="customer-icon" type="team" />
                                <div className="dashboard-details">
                                    <h5>New Customer</h5>
                                    <h3>3,241</h3>
                                </div>
                            </Card>
                        </Col>
                        <Col className="" xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                            <Card style={{ width: '100%' }}>
                                <Icon className="projects-icon" type="message" />
                                <div className="dashboard-details">
                                    <h5>Active Projects</h5>
                                    <h3>253</h3>
                                </div>
                            </Card>
                        </Col>
                        <Col className="" xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 12 }} lg={{ span: 6 }} xl={{ span: 6 }}>
                            <Card style={{ width: '100%' }}>
                                <Icon className="referrals-icon" type="shopping-cart" />
                                <div className="dashboard-details">
                                    <h5>Referrals</h5>
                                    <h3>4,324</h3>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Fragment>
        )
    }
}



export default withRouter(Dashboard);
