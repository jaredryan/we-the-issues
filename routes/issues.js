const express = require('express');
const Issue = require('../models/issue');
const issueRoutes = express();

issueRoutes.get('/', (req, res) => {
    Issue.find((err, issues) => {
        if (err) return res.status(500).send(err);
        return res.send(issues);
    });
});

issueRoutes.post('/', (req, res) => {
    const newIssue = new Issue(req.body);
    newIssue.save(err => {
        if (err) return res.status(500).send(err);
        return res.status(201).send(newIssue);
    });
});

issueRoutes.put('/:id', (req, res) => {
    Issue.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedIssue) => {
        if (err) return res.status(500).send(err);
        return res.send(updatedIssue);
    });
});

issueRoutes.delete('/:id', (req, res) => {
    Issue.findByIdAndRemove(req.params.id, (err, removedIssue) => {
        if (err) return res.status(500).send(err);
        return res.status(202).send(removedIssue);
    });
});

issueRoutes.post('/:id/comments', (req, res) => {
    Issue.findByIdAndUpdate(req.params.id, {$push: {comments: req.body}}, {new: true}, (err, updatedIssue) => {
        if (err) return res.status(500).send(err);
        return res.send(updatedIssue);
    });
});

issueRoutes.put('/:id1/comment/:id2', (req, res) => {
    Issue.findById(req.params.id1, (err, updatedIssue) => {
        if (err) return res.status(500).send(err);
        const updatedComment = updatedIssue.comments.find(comment => {
            return comment._id == req.params.id2
        });
        for (let key in req.body) {
            updatedComment[key] = req.body[key]
        }
        updatedIssue.save(err => {
            if (err) return res.status(500).send(err);
            return res.send(updatedIssue);
        });
    });
});

issueRoutes.delete('/:id1/comment/:id2', (req, res) => {
    Issue.findByIdAndUpdate(req.params.id1, {$pull: {comments: { _id: req.params.id2}}}, {new: true}, (err, updatedIssue) => {
        if (err) return res.status(500).send(err);
        return res.send(updatedIssue);
    });
});

module.exports = issueRoutes;
