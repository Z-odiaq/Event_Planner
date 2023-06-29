import Categorie from '../models/categorie.js';

export function getAll(req, res) {
    Categorie
    .find({})
    
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

export function addOnce(req, res) {
    // Invoquer la méthode create directement sur le modèle
  
    Categorie
    .create(req.body)
    .then(newCategorie => {
        res.status(200).json(newCategorie);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

export function getOnce(req, res) {
    Categorie
    .findById(req.params.id)
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}



export function updateOnce(req, res) {
    const updateFields = req.body; 
    
    Categorie
    .findOneAndUpdate({ _id: req.params.id }, updateFields, { new: true })
    .then(updatedDoc => {
        res.status(200).json("categorie est modifier");
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}



/**
 * Supprimer un seul document
 */
export function deleteOnce(req, res) {
   Categorie
    .findByIdAndDelete(req.params.id)
    
    .then(doc => {
        res.status(200).json("categorie est supprime");
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}