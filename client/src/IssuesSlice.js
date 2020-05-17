import { 
    configureStore,
    createSlice,
    getDefaultMiddleware
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import axios from 'axios';

import { client } from './App';

const getMinutes = date => date.getMinutes() < 10
    ? "0" + date.getMinutes()
    : date.getMinutes();

const getTime = date => `${date.getHours()}:${getMinutes(date)}`;

const getDate = date => (
    `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(2)}`
);

const getTimeAndDate = date => `${getTime(date)}@${getDate(date)}`

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
            state.error = null;
        },
        addIssue: (state, action) => {
            state.issues.unshift(action.payload.issue);
            state.loading = false;
            state.error = null;
            updateOtherClients(action);
        },
        updateIssue: (state, action) => {
            const updatedIssue = state.issues.find(issue => issue._id === action.payload._id);
            for (let field in action.payload.issue) {
                updatedIssue[field] = action.payload.issue[field];
            }
            state.loading = false;
            state.error = null;
            updateOtherClients(action);
        },
        updateIssueComments: (state, action) => {
            const updatedIssue = state.issues.find(issue => issue._id === action.payload._id);
            updatedIssue.comments = action.payload.updatedIssue.comments;
            state.loading = false;
            state.error = null;
            updateOtherClients(action);
        },
        deleteIssue: (state, action) => {
            const deletedIndex = state.issues.findIndex(issue => issue._id === action.payload._id);
            state.issues.splice(deletedIndex, 1);
            state.loading = false;
            state.error = null;
            updateOtherClients(action);
        },
        loading: (state) => {
            state.loading = true;
            state.error = null;
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

export const addOneVote = issue => updateIssue({ votes: issue.votes + 1 }, issue._id);

export const removeOneVote = issue => updateIssue({ votes: issue.votes - 1 }, issue._id);

export const addCommentToIssue = (text, _id) => dispatch => {
    axios.post(`/issues/${_id}/comments`, {
        text,
        date: getTimeAndDate(new Date())
    }).then(response => dispatch(slice.actions.updateIssueComments({
        updatedIssue: response.data,
        _id
    })))
    .catch(error => dispatch(slice.actions.apiError(error.response.statusText)));
};

export const updateComment = (_id, _commentId, updatedComment) => dispatch => {
    axios.put(`/issues/${_id}/comment/${_commentId}`, {
        text: updatedComment,
        date: getTimeAndDate(new Date())
    })
    .then(response => dispatch(slice.actions.updateIssueComments({
        updatedIssue: response.data,
        _id
    })))
    .catch(error => dispatch(slice.actions.apiError(error.response.statusText)));
};

export const deleteComment = (_id, _commentId) => dispatch => {
    axios.delete(`/issues/${_id}/comment/${_commentId}`)
        .then(response => dispatch(slice.actions.updateIssueComments({
            updatedIssue: response.data,
            _id
        })))
        .catch(error => dispatch(slice.actions.apiError(error.response.statusText)));
};

export const deleteIssue = _id => dispatch => {
    axios.delete("/issues/" + _id)
        .then(() => dispatch(slice.actions.deleteIssue({ _id })))
        .catch(error => dispatch(slice.actions.apiError(error.response.statusText)));
};

const formatLabelFromAction = (action) => action.type.slice(7);
export const dispatchAction = (action) => dispatch => dispatch(slice.actions[formatLabelFromAction(action)]({
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
