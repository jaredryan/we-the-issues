import React, { Component } from 'react';
import { connect } from 'react-redux';
import { w3cwebsocket } from 'websocket';

import IssueForm from './components/IssueForm';
import IssueList from './components/IssueList';
import { getIssues, dispatchAction } from './IssuesSlice';
import './app.scss';

export const client = new w3cwebsocket('ws://localhost:8000');

class App extends Component {
    componentWillMount() {
        client.onmessage = (message) => this.props.dispatchAction(JSON.parse(message.data));
    }

    componentDidMount() {
        this.props.getIssues();
    }
    
    render() {
        return (
            <div>
                <div className="banner">
                    <h1>We, the Issues</h1>
                </div>
                <IssueForm />
                <IssueList />
            </div>
        );
    }
}

export default connect(null, { getIssues, dispatchAction })(App)
