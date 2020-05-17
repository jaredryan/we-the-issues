import React from 'react';

const IssueForm = props => (
    <form onSubmit={props.handleSubmit} className="newPost">
        <div className="inputsWrapper">
            <input 
                type="text"
                name="title"
                placeholder="Post a new issue, topic, etc."
                onChange={props.handleChange}
                value={props.title}
                className="title"
            />
            <br/>
            <textarea 
                type="text"
                name="description"
                placeholder="Tell us more about it"
                onChange={props.handleChange}
                value={props.description}
                className="description"
            />
        </div>
        <div className="formButtonContainer">
            <button>Submit</button>
        </div>
    </form>
);

export default IssueForm;
