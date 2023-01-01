import mongoose from 'mongoose'

const UserSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type:String,
        unique: true,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,
}, {
    timestamps: true
});

export default mongoose.model('User', UserSchema);