import User from '../models/user';
import md5 from 'md5';

import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'

import { validationResult } from 'express-validator';

export const signUp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: errors.array()[0].msg
            })
        }

        if (await User.findOne({ email: req.body.email })) {
            return res.status(400).send({ error: 'Email is already registerd' });
        }

        let payload = req.body;
        payload.password = md5(payload.password);

        const user = new User(payload)
        await user.save();

        user.password = undefined;
        res.status(200).json({
            message: "Success!!",
            user: user
        })
    } catch (e) {
        console.log(e);
        res.status(400).send({
            error:
                'Something went wrong'
        });
    }
}

export const signIn = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: errors.array()[0].msg
            })
        }

        let payload = req.body;
        let user = await User.findOne({ email: payload.email }).populate("projectId"
            , { usersId: 0, issues: 0 })
        if (!user) {
            return res.status(400).send({ error: "Email Id not registered with us." })
        }
        if (user.password !== md5(payload.password)) {
            return res.status(400).send({ error: "Password does not match." });
        }

        user.password = undefined;

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.SECRET);

        res.status(200).send({
            message: "Success",
            token,
            users: user,
            user: {
                name: user.name,
                email: user.email,
                profile: user.profile
            }
        })
    }
    catch (e) {

        res.status(400).send({ error: 'Something went Wrong!!' })
    }
}

exports.isSignedIn = expressJwt({
    secret: 'HelloWorld',
    userProperty: "auth",
    algorithms: ['HS256']
});

// Authentication 
exports.isAuthenticated = (req, res, next) => {
    if (!req.auth && !req.auth._id) {
        return res.status(403).json({
            error: "Access Denied , Not authenticated"
        })
    }
    next();
}