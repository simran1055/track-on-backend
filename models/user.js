import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    gender: String,
    dob: String,
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