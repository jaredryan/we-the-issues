import React, {Component} from 'react';
import { connect } from 'react-redux';
import { updateIssue } from './redux';

class EditForm extends Component {
    constructor() {
        super();
        this.state = {
            title: "",
            description: "",
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    };

    componentDidMount() {
        this.setState({
            title: this.props.title,
            description: this.props.description,
        })
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.updateIssue(this.state, this.props._id);
        this.props.handleCloseForm();
    }

    handleCancel() {
        this.props.handleCloseForm();
    }

    render() {
        return(
            <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    onChange={this.handleChange}
                    value={this.state.title}
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    onChange={this.handleChange}
                    value={this.state.description}
                />
                <button type="submit">Save</button>
                <button onClick={this.handleCancel}>Cancel</button>
            </form>
        );
    };
}

export default connect(state => state, { updateIssue })(EditForm)
