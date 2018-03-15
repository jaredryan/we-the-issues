import React from 'react';
import Form from './Form';
import IssueList from './IssueList';

const App = () => {
    return(
        <div>
            <div className="banner">
                <h1>We, the Issues</h1>
            </div>
            <Form />
            <IssueList />
        </div>
    );
}

export default App;
