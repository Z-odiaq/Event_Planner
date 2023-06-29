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
        googleCalendarId: {
            type: String,
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
            ref:'Categorie', required: true 
        },
        
    },
    {
        timestamps: true // Ajouter automatiquement createdAt et updatedAt
    }
);

/**
 * Créer notre modèle à partir du schéma pour effectuer
 * des actions CRUD sur nos documents et l'exporter
 */
export default model("Evenement", evenementSchema);