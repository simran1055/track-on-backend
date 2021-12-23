import USER from '../models/user'
import PROJECT from '../models/project'
import ISSUES from '../models/issues'
import { validationResult } from 'express-validator';

exports.createProject = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: errors.array()[0].msg
            })
        }
        let data = req.body;
        data = {
            ...data, ...{
                createdBy: req.auth._id
            }
        }
        var myData = new PROJECT(data);
        let response = await myData.save();
        if (response._id != null) {
            let user = await USER.findByIdAndUpdate(
                { _id: req.auth._id },
                {
                    $push: {
                        projectId: response._id
                    }
                }
            );
            if (user == null) {
                return await PROJECT.findByIdAndRemove(response._id)
            }
            res.send({
                message: "success!!"
            })
        } else {
            res.status(400).send({ error: 'Something went Wrong!!' })
        }
    }
    catch (e) {
        res.status(400).send({ error: 'Something went Wrong!!' })
    }
}

exports.addUserProject = async (req, res) => {
    let { projectId, usersId } = req.body;
    let result = await PROJECT.findByIdAndUpdate(
        { _id: projectId, createdBy: req.auth._id },
        {
            $addToSet: {
                usersId: {
                    $each: usersId
                }
            }
        }
    )
    if (result && result != null) {
        res.send({ message: "Success!!!" })
    } else {
        res.status(400).send({ error: 'Something went Wrong!!' })
    }
}

exports.createIssue = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    var myData = new ISSUES(req.body);
    let response = await myData.save();
    if (response) {
        let projectupdate = await PROJECT.findByIdAndUpdate(
            { _id: req.body.projectId },
            { $push: { issues: response._id } }
        )
        if (projectupdate) {
            res.send({ message: "Success!!!" })
        }
        else {
            res.status(400).send({ error: 'Something went Wrong!!' })
        }
    }
    // let data = await ISSUES.

}

exports.getIssues = async (req, res) => {
    let { projectId } = req.body
    let data = await ISSUES.find({ projectId }).populate("reporterId").populate("assigneeId");
    if (data && data != null) {
        res.send(data);
    } else {
        res.status('400').send({
            error: "No data found!!!"
        })
    }
}