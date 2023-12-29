import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'bill'],
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model('Transaction', transactionSchema)