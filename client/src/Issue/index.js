import React, {Component} from 'react';
import { connect } from 'react-redux';
import { addOneVote, removeOneVote, deleteIssue, addCommentToIssue } from '../redux';
import Comment from '../Comment';
import Issue from './Issue';

class IssueContainer extends Component {
    constructor() {
        super();
        this.state = {
            isBeingEdited: false,
            newComment: ""
        }

        this.handlePlusVote = this.handlePlusVote.bind(this);
        this.handleMinusVote = this.handleMinusVote.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleOpenForm = this.handleOpenForm.bind(this);
        this.handleCloseForm = this.handleCloseForm.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addComment = this.addComment.bind(this);
    };

    handlePlusVote() {
        this.props.addOneVote(this.props)
    }
    
    handleMinusVote() {
        this.props.removeOneVote(this.props)
    }
    
    handleDelete() {
        this.props.deleteIssue(this.props._id)
    }
    
    handleEdit(issue) {
        this.props.removeOneVote(this.props)
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
    
    addComment(e) {
        e.preventDefault();
        this.props.addCommentToIssue(this.state.newComment, this.props._id);
        this.setState({
            newComment: ""
        });
    }
    
    render() {
        const commentList = this.props.comments && this.props.comments.map((comment, i) => {
            return <Comment
                        key={i + comment}
                        text={comment.text}
                        date={comment.date}
                        _id={comment._id}
                        _issueId={this.props._id}
                   />
        });
        
        return(
            <Issue 
                isBeingEdited={this.state.isBeingEdited}
                title={this.props.title}
                description={this.props.description}
                votes={this.props.votes}
                _id={this.props._id}
                handleChange={this.handleChange}
                handleOpenForm={this.handleOpenForm}
                handleCloseForm={this.handleCloseForm}
                handleDelete={this.handleDelete}
                handleMinusVote={this.handleMinusVote}
                handlePlusVote={this.handlePlusVote}
                addComment={this.addComment}
                newComment={this.state.newComment}
                commentList={commentList}
            />
        );
    };
}

export default connect(state => state, { addOneVote, removeOneVote, deleteIssue, addCommentToIssue })(IssueContainer)
