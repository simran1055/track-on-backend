import User from '../models/user';
import md5 from 'md5';
import ejs from 'ejs';

import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import bcrypt from 'bcrypt';

import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator';
import { mailFn } from '../utills/mail';

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
        payload = {
            ...payload, ...{
                verificationCode: uuidv4()
            }
        }
        const user = new User(payload)
        let result = await user.save();

        if (result) {
            res.send({ message: "Please Check Your Email!!" })
            ejs.renderFile("public/verification.ejs", { payload: { name: result.name, verificationCode: result.verificationCode, id: result.id } }, function (err, data) {
                mailFn({
                    to: req.body.email,
                    subject: "Verification Email | | Track On",
                    html: data
                })
            })
        }

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


exports.verify = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }
    const { vf, id } = req.body;
    const user = await User.findOne({ _id: id })

    if (!user) {
        return res.status(400).json({ error: 'User not found.' })
    }

    if (user.isVerified) {
        return res.json({ message: 'User already Verified.' })
    }

    if (user.verificationCode != vf) {
        return res.status(400).json({ error: 'Verification Faild' })
    }

    const userUpdate = await User.findByIdAndUpdate({
        _id: id,
        verificationCode: vf
    },
        {
            $set: {
                isVerified: true
            }
        }
    )

    if (!userUpdate) {
        return res.status(400).json(failAction('Verification Failed'))
    }

    let { _id, email, name, role } = userUpdate;
    return res.json({
        user: { _id, email, name, role, isVerified: true },
        message: 'User Verified Successfully!!'
    })
}