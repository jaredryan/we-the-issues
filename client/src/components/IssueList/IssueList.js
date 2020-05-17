import React from 'react';
import { connect } from 'react-redux';

import Issue from '../Issue';
import { getIssues } from '../../IssuesSlice';
import './issueList.scss';

const IssueList = (props) => {        
    const getIssues = () => props.issues && props.issues.slice()
        .sort((a, b) => b.votes - a.votes)
        .map((issue, i) => (
            <Issue
                key={i + issue.title}
                title={issue.title}
                description={issue.description}
                votes={issue.votes}
                comments={issue.comments}
                _id={issue._id}
            />
        ));
    
    return (
        <div className="issueList">
            {props.loading
                ? (
                    <div className="issueLoader"> 
                        <img src="ajax-loader.gif" alt="Loading..."/>
                    </div>
                )
                : getIssues()
            }
        </div>
    );
};

export default connect(state => state, { getIssues })(IssueList)
