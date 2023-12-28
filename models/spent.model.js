import mongoose from 'mongoose';

const spentSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    category_id: {
        type: String,
        required: true
    }
},{
    timestamps: true
})

export default mongoose.model('Spent', spentSchema)