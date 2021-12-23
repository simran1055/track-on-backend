import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const IssuesSchema = mongoose.Schema({
    createdAt: { type: Date, default: new Date() },
    updatedAt: Date,
    priority: String,
    reporterId: { type: ObjectId, ref: "Users" },
    status: String,
    title: String,
    type: String,
    description: String,
    assigneeId: [{ type: ObjectId, ref: "Users" }],
    projectId: { type: ObjectId, ref: "Project" }
})

export default mongoose.model('Issues', IssuesSchema)