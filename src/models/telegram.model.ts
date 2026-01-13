import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    chatId: {
        type: Number,
        required: true,
        unique: true,
    },
    lmsUrl: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: false,
        trim: true,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

const User = mongoose.model('User', userSchema)
export default User