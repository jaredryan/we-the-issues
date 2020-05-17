import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateIssue } from '../../../../IssuesSlice';
import './editIssue.scss';

class EditIssue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            description: props.description,
        }
    };

    handleChange = (e) => this.setState({ [e.target.name]: e.target.value });

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.updateIssue(this.state, this.props._id);
        this.props.handleCloseForm();
    }

    handleCancel = () => this.props.handleCloseForm();

    render() {
        return(
            <form onSubmit={this.handleSubmit} className="issueEdit">
                <div>
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        onChange={this.handleChange}
                        value={this.state.title}
                    />
                    <textarea
                        type="text"
                        name="description"
                        placeholder="Description"
                        onChange={this.handleChange}
                        value={this.state.description}
                    />
                    <button type="submit">Save</button>
                    <button onClick={this.handleCancel}>Cancel</button>
                </div>
            </form>
        );
    };
}

export default connect(null, { updateIssue })(EditIssue)
