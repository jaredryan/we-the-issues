import React, {Component} from 'react';
import { connect } from 'react-redux';
import { deleteComment, updateComment } from './redux';

class Comment extends Component {
    constructor() {
        super();
        this.state = {
            isBeingEdited: false,
            newComment: ""
        }
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleOpenForm = this.handleOpenForm.bind(this);
        this.handleCloseForm = this.handleCloseForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
    };

    componentDidMount() {
        this.setState({
            newComment: this.props.text
        })
    }

    handleDelete() {
        this.props.deleteComment(this.props._issueId, this.props._id);
    }

    handleEdit(e) {
        e.preventDefault();
        this.props.updateComment(this.props._issueId, this.props._id, this.state.newComment);
        this.handleCloseForm();
    }

    handleChange(e) {
        this.setState({
            newComment: e.target.value
        });
    }

    handleOpenForm() {
        this.setState(prevState => {
            return {
                isBeingEdited: true
            };
        })
    }

    handleCloseForm() {
        this.setState(prevState => {
            return {
                isBeingEdited: false
            };
        })
    }

    render() {
        const timeDate = this.props.date.split("@");
        return (
            <div className="comment">
                {this.state.isBeingEdited ?
                    <form onSubmit={this.handleEdit}>
                        <input
                            type="text"
                            value={this.state.newComment}
                            name="newComment"
                            placeholder="Add New Comment"
                            onChange={this.handleChange}
                        />
                        <button type="submit">Save</button>
                        <button onClick={this.handleCloseForm}>Cancel</button>
                    </form>
                    :
                    <div className="commentInfo">
                        <h4>{this.props.text}</h4>
                        <div className="row">
                            <h5>{timeDate[0]}</h5>
                            <button onClick={this.handleOpenForm}>Edit</button>
                        </div>
                        <div className="row">
                            <h5>{timeDate[1]}</h5>
                            <button onClick={this.handleDelete}>Delete</button>
                        </div>
                    </div>
                }
            </div>
        );
    };
}


export default connect(state => state, { deleteComment, updateComment })(Comment)
