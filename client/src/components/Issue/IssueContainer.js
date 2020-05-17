import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Close20 } from '@carbon/icons-react';

import {
    addOneVote,
    removeOneVote,
    deleteIssue,
    addCommentToIssue
} from '../../IssuesSlice';
import Comment from '../Comment/CommentContainer';
import ViewIssue from './components/ViewIssue/ViewIssue';
import EditIssue from './components/EditIssue/EditIssue';
import './issue.scss';

class IssueContainer extends Component {
    constructor() {
        super();
        this.state = {
            isBeingEdited: false,
            newComment: ""
        }
    };

    handlePlusVote = () => this.props.addOneVote(this.props);
    
    handleMinusVote = () => this.props.removeOneVote(this.props);
    
    handleDelete = () => this.props.deleteIssue(this.props._id);
    
    handleChange = (e) => this.setState({ newComment: e.target.value });
    
    handleOpenForm = () => this.setState({ isBeingEdited: true });
    
    handleCloseForm = () => this.setState({ isBeingEdited: false });
    
    addComment = (e) => {
        e.preventDefault();
        this.props.addCommentToIssue(this.state.newComment, this.props._id);
        this.setState({
            newComment: ""
        });
    }

    getCommentList = () => this.props.comments && this.props.comments.map((comment, i) => (
        <Comment
            key={i + comment}
            text={comment.text}
            date={comment.date}
            _id={comment._id}
            _issueId={this.props._id}
        />
    ));
    
    render() {        
        return (
            <div className="issue">
                <Close20
                    className="deleteIcon"
                    aria-label="Delete"
                    onClick={this.handleDelete}
                />
                {this.state.isBeingEdited
                    ? (
                        <EditIssue
                            title={this.props.title}
                            description={this.props.description}
                            _id={this.props._id}
                            handleCloseForm={this.handleCloseForm}
                        />
                    )
                    : (
                        <ViewIssue
                            title={this.props.title}
                            description={this.props.description}
                            votes={this.props.votes}
                            commentList={this.getCommentList()}
                            addComment={this.addComment}
                            newComment={this.state.newComment}
                            handleMinusVote={this.handleMinusVote}
                            handlePlusVote={this.handlePlusVote}
                            handleOpenForm={this.handleOpenForm}
                            handleCloseForm={this.handleCloseForm}
                            handleChange={this.handleChange}
                        />
                    )
                }
            </div>
        );
    };
}

export default connect(null, {
    addOneVote,
    removeOneVote,
    deleteIssue,
    addCommentToIssue
})(IssueContainer);
