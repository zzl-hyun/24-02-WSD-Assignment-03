const mongoose = require('mongoose');

// {
//     "_id": "ObjectId",
//     "user_id": "ObjectId",  // References Users._id
//     "type": "application_status",  // e.g., "application_status", "system_alert"
//     "message": "Your application for Software Engineer has been accepted.",
//     "is_read": false,
//     "created_at": "2024-11-28"
//   }


const notificationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    type: { type: String, enum: ['application_status', 'system_alert'], required: true },
    message: { type: String, required: true },
    is_read: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);