import React, {Component} from 'react';
import { connect } from 'react-redux';
import { addIssue } from './redux';

class Form extends Component {
    constructor() {
        super();
        this.state = {
            title: "",
            description: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    
    handleSubmit(e) {
        e.preventDefault();
        this.props.addIssue(this.state);
        this.setState({
            title: "",
            description: ""
        });
    }

    render() {
        return(
            <form onSubmit={this.handleSubmit} className="newPost">
                <div className="inputsWrapper">
                    <input 
                        type="text"
                        name="title"
                        placeholder="Post a new issue, topic, etc."
                        onChange={this.handleChange}
                        value={this.state.title}
                        className="title"
                    />
                    <br/>
                    <textarea 
                        type="text"
                        name="description"
                        placeholder="Tell us more about it"
                        onChange={this.handleChange}
                        value={this.state.description}
                        className="description"
                    />
                </div>
                <br/>
                <button>Submit</button>
            </form>
        );
    };
}

export default connect(state => state, { addIssue })(Form)
