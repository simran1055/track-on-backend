import express from 'express';
import { check } from 'express-validator';
import { signUp, signIn } from '../api/user';

const app = express();

app.post(
    "/sign-up",
    [
        check("name", "Name should be at least 3 chars").isLength({ min: 3 }),
        check("email", "Valid Email is required").isEmail(),
        check("password", "Password should be at least 3 chars").isLength({ min: 3 })
    ],
    signUp
);
app.post(
    "/sign-in",
    [
        check("email", "Valid Email is required").isEmail(),
        check("password", "Password should be at least 3 chars").isLength({ min: 3 })
    ],
    signIn
);

export default app;