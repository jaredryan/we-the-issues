import React, {Component} from 'react';
import { connect } from 'react-redux';

import { deleteComment, updateComment } from '../../IssuesSlice';
import EditComment from './components/EditComment';
import ViewComment from './components/ViewComment';
import './comment.scss';

class CommentContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isBeingEdited: false,
            newComment: props.text
        }
    };

    handleDelete = () => this.props.deleteComment(this.props._issueId, this.props._id);

    handleEdit = (e) => {
        e.preventDefault();
        this.props.updateComment(this.props._issueId, this.props._id, this.state.newComment);
        this.handleCloseForm();
    }

    handleChange = (e) => this.setState({
        newComment: e.target.value
    });

    handleOpenForm = () => this.setState({ isBeingEdited: true });

    handleCloseForm = () => this.setState({ isBeingEdited: false });

    render() {
        const timeDate = this.props.date.split("@");
        return (
            <div className="comment">
                {this.state.isBeingEdited
                    ? (
                        <EditComment
                            newComment={this.state.newComment}
                            handleChange={this.handleChange}
                            handleEdit={this.handleEdit}
                            handleCloseForm={this.handleOpenForm}
                        />
                    )
                    : (
                        <ViewComment
                            text={this.props.text}
                            time={timeDate[0]}
                            date={timeDate[1]}
                            handleOpenForm={this.handleOpenForm}
                            handleDelete={this.handleDelete}
                        />
                    )
                }
            </div>
        );
    };
}


export default connect(null, { deleteComment, updateComment })(CommentContainer);
