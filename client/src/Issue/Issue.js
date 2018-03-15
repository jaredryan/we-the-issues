import React from 'react';
import EditForm from '../EditForm';

const Issue = props => {
    return(
        <div className="issue">
            {props.isBeingEdited ? 
                <EditForm 
                    title={props.title}
                    description={props.description}
                    _id={props._id}
                    handleCloseForm={props.handleCloseForm}
                />
                :
                <div className="issueInfo">
                    <h1>{props.title}</h1>
                    <h2>{props.description}</h2>
                    <div className="voting">
                        <button onClick={props.handleMinusVote}>-</button>
                        <h3>Votes: {props.votes}</h3>
                        <button onClick={props.handlePlusVote}>+</button>
                    </div>
                    {props.commentList}
                    <form onSubmit={props.addComment}>
                            <input
                                type="text"
                                value={props.newComment}
                                name="newComment"
                                placeholder="New Comment"
                                onChange={props.handleChange}
                            />
                            <br/>
                            <button type="submit">Post</button>
                    </form>
                    <button onClick={props.handleOpenForm}>Edit</button>
                    <button onClick={props.handleDelete}>Delete</button>
                </div>
            }
        </div>
    );
}

export default Issue;
