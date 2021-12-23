import express from 'express';
import { isAuthenticated, isSignedIn } from '../api/user';
import { createProject, addUserProject, createIssue,getIssues } from '../api/project';
import { check } from 'express-validator';

const app = express();

app.post(
    "/create-project",
    [
        check("name", "Name should be at least 3 chars").isLength({ min: 3 }),
        check("category", "Category is required"),
        check("description", "Description should be at least 3 chars").isLength({ min: 3 })
    ],
    isSignedIn,
    isAuthenticated,
    createProject
);
app.post(
    "/add-user",
    isSignedIn,
    isAuthenticated,
    addUserProject
)
app.post('/get-issue', isSignedIn, isAuthenticated, getIssues);
app.post(
    "/create-issue",
    [
        check("title", "title should be at least 3 chars").isLength({ min: 3 }),
        check("priority", "priority is required"),
        check("description", "Description should be at least 3 chars").isLength({ min: 3 }),
        check("reporterId", "reporterId is required"),
        check("status", "status is required"),
        check("assigneeId", "assigneeId is required"),
        check("projectId", "projectId is required")
    ],
    isSignedIn,
    isAuthenticated,
    createIssue
)

export default app;
