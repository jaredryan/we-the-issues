import { configureStore, createSlice, getDefaultMiddleware } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import axios from 'axios';

import { client } from '../App';

const initialState = {
    issues: [],
    error: "",
    loading: false
};

const updateOtherClients = (action) => !action.payload.fromWebSocket && client.send(JSON.stringify(action));

const slice = createSlice({
    name: 'issues',
    initialState,
    reducers: {
        getIssues: (state, action) => {
            state.issues = action.payload.issues;
            state.loading = false;
            state.error = "";
        },
        addIssue: (state, action) => {
            state.issues.unshift(action.payload.issue);
            state.loading = false;
            state.error = "";
            updateOtherClients(action);
        },
        changeOneVote: (state, action) => {
            const issues = state.issues;
            const updatedIssue = issues.find(issue => issue._id === action.payload._id);
            updatedIssue.votes = action.payload.votes;
            state.issues = issues;
            state.loading = false;
            state.error = "";
            updateOtherClients(action);
        },
        updateIssue: (state, action) => {
            const issues = state.issues;
            const updatedIssue = issues.find(issue => issue._id === action.payload._id);
            for (let field in action.payload.issue) {
                updatedIssue[field] = action.payload.issue[field];
            }
            state.issues = issues;
            state.loading = false;
            state.error = "";
            updateOtherClients(action);
        },
        updateCommentToIssue: (state, action) => {
            const issues = state.issues;
            const updatedIssue = issues.find(issue => issue._id === action.payload._id);
            updatedIssue.comments = action.payload.updatedIssue.comments;
            state.issues = issues;
            state.loading = false;
            state.error = "";
            updateOtherClients(action);
        },
        deleteIssue: (state, action) => {
            const issues = state.issues;
            const deletedIndex = issues.findIndex(issue => issue._id === action.payload._id);
            issues.splice(deletedIndex, 1);
            state.issues = issues;
            state.loading = false;
            state.error = "";
            updateOtherClients(action);
        },
        loading: (state) => {
            state.loading = true;
            state.error = "";
        },
        apiError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

export const getIssues = () => dispatch => {
    slice.actions.loading();
    setTimeout(() => {
        axios.get("/issues")
            .then(response => dispatch(slice.actions.getIssues({ issues: response.data })))
            .catch(error => dispatch(slice.actions.apiError(error.response.statusText)));
    }, 1000)
}

export const addIssue = issue => dispatch => {
    issue.votes = 0;
    axios.post("/issues", issue)
        .then(response => dispatch(slice.actions.addIssue({ issue: response.data })))
        .catch(error => dispatch(slice.actions.apiError(error.response.statusText)));
}

export const updateIssue = (issue, _id) => dispatch => {
    axios.put("/issues/" + _id, issue)
        .then(() => dispatch(slice.actions.updateIssue({
            issue,
            _id
        })))
        .catch(error => dispatch(slice.actions.apiError(error.response.statusText)));
};

export const deleteIssue = _id => dispatch => {
    axios.delete("/issues/" + _id)
        .then(() => dispatch(slice.actions.deleteIssue({ _id })))
        .catch(error => dispatch(slice.actions.apiError(error.response.statusText)));
};

export const addCommentToIssue = (text, _id) => dispatch => {
    const currentdate = new Date();
    let date = currentdate.getHours() + ":";
    date += currentdate.getMinutes() < 10 ?
        "0" + currentdate.getMinutes() :
        currentdate.getMinutes();
    date += "@" + (currentdate.getMonth() + 1) + "/"
        + currentdate.getDate() + "/"
        + currentdate.getFullYear().toString().slice(2)
    const comment = { text, date }
    axios.post(`/issues/${_id}/comments`, comment)
        .then(response => dispatch(slice.actions.updateCommentToIssue({
            updatedIssue: response.data,
            _id
        })))
        .catch(error => dispatch(slice.actions.apiError(error.response.statusText)));
}

export const addOneVote = issue => dispatch => {
    const votes = issue.votes + 1;
    axios.put("/issues/" + issue._id, { votes })
        .then(() => dispatch(slice.actions.changeOneVote({
            votes,
            _id: issue._id
        })))
        .catch(error => dispatch(slice.actions.apiError(error.response.statusText)));
};

export const deleteComment = (_id, _commentId) => dispatch => {
    axios.delete(`/issues/${_id}/comment/${_commentId}`)
        .then(response => dispatch(slice.actions.updateCommentToIssue({
            updatedIssue: response.data,
            _id
        })))
        .catch(error => dispatch(slice.actions.apiError(error.response.statusText)));
};

export const removeOneVote = issue => dispatch => {
    const votes = issue.votes - 1;
    axios.put("/issues/" + issue._id, { votes })
        .then(() => dispatch(slice.actions.changeOneVote({
            votes,
            _id: issue._id
        })))
        .catch(error => dispatch(slice.actions.apiError(error.response.statusText)));
};

export const updateComment = (_id, _commentId, updatedComment) => dispatch => {
    const currentdate = new Date();
    let date = currentdate.getHours() + ":";
    date += currentdate.getMinutes() < 10 ?
        "0" + currentdate.getMinutes() :
        currentdate.getMinutes();
    date += "@" + (currentdate.getMonth() + 1) + "/"
        + currentdate.getDate() + "/"
        + currentdate.getFullYear().toString().slice(2);
    axios.put(`/issues/${_id}/comment/${_commentId}`, { text: updatedComment, date })
        .then(response => dispatch(slice.actions.updateCommentToIssue({
            updatedIssue: response.data,
            _id
        })))
        .catch(error => dispatch(slice.actions.apiError(error.response.statusText)));
};

const removeIssuesFromAction = (action) => action.type.slice(7);
export const dispatchAction = (action) => dispatch => dispatch(slice.actions[removeIssuesFromAction(action)]({
    ...action.payload,
    fromWebSocket: true,
}));

export default configureStore({ 
    reducer: slice.reducer,
    middleware: [
        ...getDefaultMiddleware(),
        logger,
    ]
});
