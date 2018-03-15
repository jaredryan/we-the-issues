import React, {Component} from 'react';
import { connect } from 'react-redux';
import Issue from './Issue';
import { getIssues } from './redux';

class IssueList extends Component {        
    componentDidMount() {
        this.props.getIssues();
    }

    render() {
        const issues = this.props.issues && this.props.issues
            .sort((a, b) => b.votes - a.votes)
            .map((issue, i) => {
            return (
                <Issue
                    key={i + issue.title}
                    title={issue.title}
                    description={issue.description}
                    votes={issue.votes}
                    comments={issue.comments}
                    _id={issue._id}
                />
            )
        });
    
        return(
            <div className="issueList">
                {this.props.loading ?
                    <h3>Loading...</h3>:
                    issues}
            </div>
        );
    };
}

export default connect(state => state, { getIssues })(IssueList)
