import React from 'react';
import { Edit16 } from '@carbon/icons-react';

import './viewIssue.scss';

const ViewIssue = props => (
    <div className="issueInfo">
        <div className="heading">
            <div>
                <h1>{props.title}</h1>
                <Edit16 aria-label="Edit" onClick={props.handleOpenForm} />
            </div>
            <h2>{props.description}</h2>
        </div>
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
    </div>
);

export default ViewIssue;
