import mongoose from 'mongoose'; // Importer Mongoose
const { Schema, model } = mongoose; // Utiliser Schema et model du module mongoose

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        default: false
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
},
    {
        timestamps: true 

});

export default model("Notification", notificationSchema);

