import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
}, {
    timestamps: true
})

export default mongoose.model('Goal', goalSchema)