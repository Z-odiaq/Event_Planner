import Evenement from '../models/evenement.js';
import  mongoose  from 'mongoose';
import ObjectID  from 'mongodb';
import { google } from 'googleapis';
import  authorize  from '../services/googleAuth.js';


export function getAll(req, res) {
    Evenement
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
req.body.categorie = ObjectID.ObjectID("649dc76cee95ec2a0d7c9de0");

    Evenement
        .create(req.body)
        .then(doc => {
            const auth = authorize();

            // Add your event creation logic here
            const calendar = google.calendar({ version: 'v3', auth });
            const event = {
                // add event details here
                summary: doc.name,
                location: doc.lieu,
                description: doc.description,
                start: {
                    dateTime: doc.date,
                    timeZone: 'Africa/Tunis',

                },
                end: {
                    dateTime: doc.dateFin,
                    timeZone: 'Africa/Tunis',
                },

            };
            console.log("event", event);

            calendar.events.insert(
                {
                    calendarId: 'primary',
                    resource: event,
                },
                (err, event) => {
                    if (err) {
                        console.error('Error creating event:', err);
                        res.status(500).json({ error: 'Failed to create event' });
                    } else {
                        doc.googleCalendarId = event.id;
                        console.log('Event created: %s', event.htmlLink);
                        doc.save();
                        /*user.findById(req.body.id).then(user => {
                        user.notifications.push({type: "evenement", message: "Votre participation à l'événement " + doc.name +" a été confirmée"});
                        user.save();
                        });*/
                        res.status(200).json({ message: 'participation avec succès' });
                    }
                }
            );
            //res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

export function getOnce(req, res) {
    Evenement
        .findById(req.params.id)
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

// search
export function getSearch(req, res) {
    const query = req.query.q;

    //search by name or date or lieu or description or categorie
    Evenement.find({ $or: [{ name: query }, { date: query }, { lieu: query }, { description: query }, { categorie: query }] })
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

//tri events by date
export function getTri(req, res) {
    let sort = req.query.tri = 'ASC' ? 1 : -1;
    Evenement.find({}).sort({ date: sort })
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

//tri events by category
export function getTriCat(req, res) {
    let sort = req.query.tri = 'ASC' ? 1 : -1;
    Evenement.find({}).sort({ categorie: sort })
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
        .findById(req.params.id)
        .then(doc => {
            if (doc.participants.includes(req.body.id)) {
                res.status(500).json({ error: "déjà participé" });
            } else if (doc.participants.length >= doc.nbparticipant) {
                res.status(500).json({ error: "Le nb max des participants est atteint" });
            } else {
                Evenement
                    .findByIdAndUpdate(req.params.id, { $push: { participants: req.body.id }, $inc: { nbparticipant: +1 } })
                    .then(doc => {
                        //google calendar
                        res.status(200).json(doc);
                    })
                    .catch(err => {
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
        .findById(req.params.id)
        .then(doc => {
            if (doc.participants.includes(req.body.id)) {
                Evenement
                    .findByIdAndUpdate(req.params.id, { $pull: { participants: req.body.id }, $inc: { nbparticipant: -1 } })
                    .then(doc => {
                        //google calendar
                        res.status(200).json(doc);
                    })
                    .catch(err => {
                        res.status(500).json({ error: err });
                    });
            } else {
                res.status(500).json({ error: "vous n'avez pas participé à cet événement" });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}





export function updateOnce(req, res) {
    const updateFields = req.body;

    Evenement
        .findOneAndUpdate({ _id: req.params.id }, updateFields, { new: true })
        .then(updatedDoc => {
            res.status(200).json("evenement est modifier");
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}



/**
 * Supprimer un seul document
 */
export function deleteOnce(req, res) {
    Evenement
        .findByIdAndDelete(req.params.id)

        .then(doc => {
            const auth = authorize();
                        // Add your event deletion logic here
                        const calendar = google.calendar({ version: 'v3', auth });
                        calendar.events.delete(
                            {
                                calendarId: 'primary',
                                eventId: doc.googleCalendarId,
                            },
                            (err, event) => {
                                if (err) {
                                    console.error('Error deleting event:', err);
                                    res.status(500).json({ error: 'Failed to delete event' });
                                } else {
                                    /*user.findById(req.body.id).then(user => {
                                      user.notifications.push({type: "evenement", message: "vous avez annulé votre participation à l'événement " + doc.name});
                                      user.save();
                                    });*/
                                    res
                                        .status(200)
                                        .json({ message: 'participation annulée avec succès' });
                                }
                            }
                        );
            res.status(200).json("evenement est supprime");
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

function googleCalendarInsert(doc) {
    const auth = authorize();

    // Add your event creation logic here
    const calendar = google.calendar({ version: 'v3', auth });
    const event = {
        // add event details here
        summary: doc.name,
        location: doc.lieu,
        description: doc.description,
        start: {
            dateTime: doc.date,
            timeZone: 'Africa/Tunis',

        },
        end: {
            dateTime: doc.dateFin,
            timeZone: 'Africa/Tunis',
        },

    };

    calendar.events.insert(
        {
            calendarId: 'primary',
            resource: event,
        },
        (err, event) => {
            if (err) {
                console.error('Error creating event:', err);
                res.status(500).json({ error: 'Failed to create event' });
            } else {
                doc.googleCalendarId = event.id;
                doc.save();
                /*user.findById(req.body.id).then(user => {
                user.notifications.push({type: "evenement", message: "Votre participation à l'événement " + doc.name +" a été confirmée"});
                user.save();
                });*/
                res.status(200).json({ message: 'participation avec succès' });
            }
        }
    );

}

function googleCalendarDelete(doc) {
    const auth = authorize();
    // Add your event deletion logic here
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.delete(
        {
            calendarId: 'primary',
            eventId: doc.googleCalendarId,
        },
        (err, event) => {
            if (err) {
                console.error('Error deleting event:', err);
                res.status(500).json({ error: 'Failed to delete event' });
            } else {
                /*user.findById(req.body.id).then(user => {
                  user.notifications.push({type: "evenement", message: "vous avez annulé votre participation à l'événement " + doc.name});
                  user.save();
                });*/
                res
                    .status(200)
                    .json({ message: 'participation annulée avec succès' });
            }
        }
    );

}