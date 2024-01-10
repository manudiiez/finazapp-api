import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'bill'],
        required: true
    },
    color: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model('Category', categorySchema) 