import React from 'react';

import './viewComment.scss';

const ViewComment = (props) => (
    <div className="commentInfo">
        <h4>{props.text}</h4>
        <div className="row">
            <h5>{props.time}</h5>
            <button onClick={props.handleOpenForm}>Edit</button>
        </div>
        <div className="row">
            <h5>{props.date}</h5>
            <button onClick={props.handleDelete}>Delete</button>
        </div>
    </div>
)

export default ViewComment;
