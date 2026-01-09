import mongoose from 'mongoose';

const brandingSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        default: 'This service is used by XYZ'
    }
}, {
    timestamps: true
});

export default mongoose.model('Branding', brandingSchema);

