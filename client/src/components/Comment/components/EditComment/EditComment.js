import React from 'react';

import './editComment.scss';

const EditComment = (props) => (
    <form onSubmit={props.handleEdit}>
        <input
            type="text"
            value={props.newComment}
            name="newComment"
            placeholder="Add New Comment"
            onChange={props.handleChange}
        />
        <br />
        <button type="submit">Save</button>
        <button onClick={props.handleCloseForm}>Cancel</button>
    </form>
)

export default EditComment;
