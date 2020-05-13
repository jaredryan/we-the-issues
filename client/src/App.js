import React, { Component } from 'react';
import { connect } from 'react-redux';
import { w3cwebsocket } from 'websocket';

import Form from './Form';
import IssueList from './IssueList';
import { dispatchAction } from './redux';

export const client = new w3cwebsocket('ws://localhost:8000');
export let webSocketIsReady = false;

class App extends Component {
    componentWillMount() {
        client.onopen = () => {
            webSocketIsReady = true;
        };
        client.onmessage = (message) => {
            console.log('on message')
            this.props.dispatchAction(JSON.parse(message.data));
        };
    }
    
    render() {
        return(
            <div>
                <div className="banner">
                    <h1>We, the Issues</h1>
                </div>
                <Form />
                <IssueList />
            </div>
        );
    }
}

export default connect(state => state, { dispatchAction })(App)
