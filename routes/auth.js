import express from 'express';
import { check } from 'express-validator';
import { signUp, signIn, verify } from '../api/user';
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

app.post('/verify-email',
    [check("vf", "Verification Faild!"),
    check("id", "User Not Found!"),
    ],
    verify)

export default app;