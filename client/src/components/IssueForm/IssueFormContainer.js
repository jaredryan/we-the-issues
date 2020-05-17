import React, {Component} from 'react';
import { connect } from 'react-redux';

import { addIssue } from '../../IssuesSlice';
import IssueForm from './IssueForm';
import './issueForm.scss';

class Form extends Component {
    constructor() {
        super();
        this.state = {
            title: "",
            description: ""
        }
    };

    handleChange = (e) => this.setState({
        [e.target.name]: e.target.value
    });
    
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.addIssue(this.state);
        this.setState({
            title: "",
            description: ""
        });
    }

    render() {
        return (
            <IssueForm
                title={this.state.title}
                description={this.state.description}
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
            />
        );
    };
}

export default connect(null, { addIssue })(Form)
