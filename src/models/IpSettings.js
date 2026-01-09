import mongoose from 'mongoose';

const ipSettingsSchema = new mongoose.Schema({
    ipWhitelist: {
        type: [String],
        default: []
    },
    isIpRestrictionEnabled: {
        type: Boolean,
        default: false
    },
    staticIP: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

export default mongoose.model('IpSettings', ipSettingsSchema);

