import mongoose from 'mongoose';

const cookieSchema = new mongoose.Schema({
    cookies: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Cookie', cookieSchema);

