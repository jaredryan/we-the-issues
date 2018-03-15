import { createStore, applyMiddleware } from "redux";
import axios from "axios";
import thunk from "redux-thunk";

export const getIssues = () => {
    return dispatch => {
        dispatch({
            type: "LOADING"
        });
        setTimeout(() => {
            axios.get("/issues")
            .then(response => {
                dispatch({
                    type: "GET_ISSUES",
                    issues: response.data
                });
            })
            .catch(error => {
                dispatch({
                    type: "ERROR",
                    error: error.response.statusText
                });
            });
        }, 1000)
    }
}

export const addIssue = issue => {
    return dispatch => {
        issue.votes = 0;
        axios.post("/issues", issue)
        .then(response => {
            dispatch({
                type: "ADD_ISSUE",
                issue: response.data
            });
        })
        .catch(error => {
            dispatch({
                type: "ERROR",
                error: error.response.statusText
            });
        });
    }
}

export const addOneVote = issue => {
    return dispatch => {
        const votes = issue.votes + 1;
        axios.put("/issues/" + issue._id , {votes})
        .then(response => {
            dispatch({
                type: "CHANGE_ONE_VOTE",
                votes,
                _id: issue._id
            });
        })
        .catch(error => {
            dispatch({
                type: "ERROR",
                error: error.response.statusText
            });
        });
    }
}

export const removeOneVote = issue => {
    return dispatch => {
        const votes = issue.votes - 1;
        axios.put("/issues/" + issue._id , {votes})
        .then(response => {
            dispatch({
                type: "CHANGE_ONE_VOTE",
                votes,
                _id: issue._id
            });
        })
        .catch(error => {
            dispatch({
                type: "ERROR",
                error: error.response.statusText
            });
        });
    }
}

export const addCommentToIssue = (text, _id) => {
    return dispatch => {
        const currentdate = new Date();
        let date = currentdate.getHours() + ":";
        date += currentdate.getMinutes() < 10 ?
                         "0" + currentdate.getMinutes() :
                         currentdate.getMinutes();
        date += "@" + (currentdate.getMonth()+1) + "/"
                       + currentdate.getDate()  + "/"
                       + currentdate.getFullYear().toString().slice(2)
        const comment = {text, date}
        axios.post(`/issues/${_id}/comments`, comment)
        .then(response => {
            dispatch({
                type: "UPDATE_COMMENT_TO_ISSUE",
                updatedIssue: response.data,
                _id
            });
        })
        .catch(error => {
            dispatch({
                type: "ERROR",
                error: error.response.statusText
            });
        });
    }
}

export const updateIssue = (issue, _id) => {
    return dispatch => {
        axios.put("/issues/" + _id , issue)
        .then(response => {
            dispatch({
                type: "UPDATE_ISSUE",
                issue,
                _id
            });
        })
        .catch(error => {
            dispatch({
                type: "ERROR",
                error: error.response.statusText
            });
        });
    }
}

export const deleteIssue = _id => {
    return dispatch => {
        axios.delete("/issues/" + _id)
        .then(response => {
            dispatch({
                type: "DELETE_ISSUE",
                _id
            });
        })
        .catch(error => {
            dispatch({
                type: "ERROR",
                error: error.response.statusText
            });
        });
    }
}

export const deleteComment = (_id, _commentId) => {
    return dispatch => {
        axios.delete(`/issues/${_id}/comment/${_commentId}`)
        .then(response => {
            dispatch({
                type: "UPDATE_COMMENT_TO_ISSUE",
                updatedIssue: response.data,
                _id
            });
        })
        .catch(error => {
            dispatch({
                type: "ERROR",
                error: error.response.statusText
            });
        });
    }
}

export const updateComment = (_id, _commentId, updatedComment) => {
    return dispatch => {
        const currentdate = new Date();
        let date = currentdate.getHours() + ":";
        date += currentdate.getMinutes() < 10 ?
                         "0" + currentdate.getMinutes() :
                         currentdate.getMinutes();
        date += "@" + (currentdate.getMonth()+1) + "/"
                       + currentdate.getDate()  + "/"
                       + currentdate.getFullYear().toString().slice(2);
        axios.put(`/issues/${_id}/comment/${_commentId}`, {text: updatedComment, date})
        .then(response => {
            dispatch({
                type: "UPDATE_COMMENT_TO_ISSUE",
                updatedIssue: response.data,
                _id
            });
        })
        .catch(error => {
            dispatch({
                type: "ERROR",
                error: error.response.statusText
            });
        });
    }
}

const initialState = {
    issues: [],
    error: "",
    loading: false
}

export const reducer = (prevState = initialState, action) => {
    let issues;
    let updatedIssue;
    let deletedIndex;
    switch (action.type) {
        case "GET_ISSUES":
            return {
                issues: action.issues,
                loading: false,
                error: ""
            };
        case "ADD_ISSUE":
            return {
                issues: [action.issue, ...prevState.issues],
                loading: false,
                error: ""
            };
        case "CHANGE_ONE_VOTE":
            issues = prevState.issues.slice();
            updatedIssue = issues.find(issue => issue._id === action._id)
            updatedIssue.votes = action.votes
            return {
                issues,
                loading: false,
                error: ""
            };
        case "UPDATE_ISSUE":
            issues = prevState.issues.slice();
            updatedIssue = issues.find(issue => issue._id === action._id)
            for (let field in action.issue) {
                updatedIssue[field] = action.issue[field];
            }
            return {
                issues,
                loading: false,
                error: ""
            };
        case "UPDATE_COMMENT_TO_ISSUE":
            issues = prevState.issues.slice();
            updatedIssue = issues.find(issue => issue._id === action._id);
            updatedIssue.comments = action.updatedIssue.comments;
            return {
                issues,
                loading: false,
                error: ""
            };
        case "DELETE_ISSUE":
            issues = prevState.issues.slice();
            deletedIndex = issues.findIndex(issue => issue._id === action._id);
            issues.splice(deletedIndex, 1)
            return {
                issues,
                loading: false,
                error: ""
            };
        case "LOADING":
            return {
                issues: prevState.issues,
                loading: true,
                error: ""
            };
        case "ERROR":
            return {
                ...prevState,
                error: action.error,
                loading: false
            };
        default:
            return prevState;
    }
}


export default createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunk)
);
