import mongoose from 'mongoose'; // Importer Mongoose
const { Schema, model } = mongoose; // Utiliser Schema et model du module mongoose

// Créez votre schéma qui décrit à quoi ressemblera chaque document
const evenementSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true // Cet attribut est obligatoire
        },
        nbparticipant: {
            type: Number,
            default: 0,
            required: true
        },
        date: {
            type: String,
            required: true
        },
        dateFin: {
            type: String,
            required: true
        },
        lieu: {
            type: String,
            required: true
        },
        participants: [{
            ref: "User",
            type: mongoose.Schema.Types.ObjectId,
        }],
        description: {
            type: String,
            required: true
        },
        categorie : { 
            type: mongoose.Schema.Types.ObjectId, 
            ref:'Categorie', 
            required: true 
        },
        
    },
    {
        timestamps: true // Ajouter automatiquement createdAt et updatedAt
    }
);


export default model("Evenement", evenementSchema);