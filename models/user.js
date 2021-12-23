import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    gender: String,
    dob: String,
    verificationCode: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: Number,
        default: 2 //2 for user, 1 for admin, 0 for super admin
    },
    profile: {
        type: String,
        default: 'https://picsum.photos/200/300'
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    projectId: [{ type: ObjectId, ref: "Project" }]
})

export default mongoose.model('Users', UserSchema)