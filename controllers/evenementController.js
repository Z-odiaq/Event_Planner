import Evenement from '../models/evenement.js';
import ObjectID from 'mongodb';
import Notification from '../models/notification.js';

//get all events

export function getAll(req, res) {
    Evenement.find({}).then
        (docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

//get all events by category
export function getAllByCat(req, res) {
    Evenement.find({ categorie: req.params.id }).then
        (docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

//get all events by user
export function getAllByUser(req, res) {
    Evenement.find({ user: req.params.id }).then
        (docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

//create event
export function add(req, res) {

    const evenement = new Evenement({
        name: req.body.name,
        description: req.body.description,
        date: new Date(req.body.date).toISOString(),
        dateFin: new Date(req.body.date).toISOString(),
        lieu: req.body.lieu,
        categorie: ObjectID.ObjectID(req.body.categorie),
        user: req.body.user,
    });
    evenement.save().then(doc => {
        res.status(200).json(doc);
    }).catch(err => {
        res.status(500).json({ error: err });
    });
}

//delete event
export function deleteById(req, res) {
    //add notification to all participants 

    Evenement.findById(req.params.id).then(doc => {
        const participants = doc.participants;
        participants.forEach(participant => {
            const notification = new Notification({
                type: "event",
                message: "l'evenement " + doc.name + " a été supprimé",
                date: new Date().toISOString(),
                user: participant
            })
        }).then(notification => {
            notification.save();
            doc.remove().then(doc => {
                res.status(200).json(doc);
            }).catch(err => {
                res.status(500).json({ error: err });
            });
        }).catch(err => {
            res.status(500).json({ error: err });
        });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
}

//update event
export function update(req, res) {
    Evenement.findByIdAndUpdate(req.params.id, req.body).then(doc => {
        res.status(200).json(doc);
    }).catch(err => {
        res.status(500).json({ error: err });
    });
}

//get event by id
export function getById(req, res) {
    Evenement.findById(req.params.id).then(doc => {
        res.status(200).json(doc);
    }).catch(err => {
        res.status(500).json({ error: err });
    });
}

//get event by name
export function getByName(req, res) {
    Evenement.find({ name: req.params.name }).then(doc => {
        res.status(200).json(doc);
    }).catch(err => {
        res.status(500).json({ error: err });
    });
}

//get event by date
export function getByDate(req, res) {
    console.log(req.params.date);

    Evenement.find({ date: new Date(req.params.date).toISOString() }).then(doc => {
        res.status(200).json(doc);
    }).catch(err => {
        res.status(500).json({ error: err });
    });
}

//get between two dates
export function getBetween(req, res) {
    Evenement.find({ date: { $gte: new Date(req.body.date1).toISOString(), $lte: new Date(req.body.date2).toISOString() } }).then(doc => {
        res.status(200).json(doc);
    }).catch(err => {
        res.status(500).json({ error: err });
    });
}

// search
export function getSearch(req, res) {
    console.log("ddd", req.query.q);
    const query = req.query.q;
    Evenement.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { date: { $regex: query, $options: 'i' } },
            { lieu: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
        ],
    }).then(doc => {
        res.status(200).json(doc);
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

//tri events by date
export function getTri(req, res) {
    let sort = req.query.sort === 'ASC' ? 1 : -1;
    Evenement.find({}).sort({ date: sort })
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

//participate to event
export function participate(req, res) {
    Evenement
        .findById(req.body.event)
        .then(doc => {
            if (doc.participants.includes(req.body.user)) {
                res.status(500).json({ error: "déjà participé" });
            } else if (doc.participants.length >= doc.nbparticipant) {
                res.status(500).json({ error: "Le nb max des participants est atteint" });
            } else {
                doc.participants.push(req.body.user);
                doc.save().then(doc => {
                    //google calendar
                    res.status(200).json(doc);
                }).catch(err => {
                    res.status(500).json({ error: err });
                });

            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

//unparticipate from event
export function unparticipate(req, res) {
    Evenement
        .findById(req.body.event)
        .then(doc => {
            if (!doc.participants.includes(req.body.user)) {
                res.status(500).json({ error: "déjà unparticipé" });
            } else {
                doc.participants.pull(req.body.user);
                doc.save().then(doc => {
                    res.status(200).json(doc);
                }).catch(err => {
                    res.status(500).json({ error: err });
                });

            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}



