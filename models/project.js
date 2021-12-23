import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const ProjectSchema = mongoose.Schema({
    name: String,
    url: String,
    description: String,
    category: String,
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date },
    createdBy: { type: ObjectId, ref: "Users" },
    usersId: [{ type: ObjectId, ref: "Users" }],
    issues: [{ type: ObjectId, ref: "Issues" }]
})

export default mongoose.model('Project', ProjectSchema)