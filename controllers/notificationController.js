
import notification from '../models/notification.js';
import Notification from '../models/notification.js';


export function getAll(req, res) {
    Notification.find({}).then
        (docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

export function add(req, res) {

    const notification = new Notification({
        user: req.body.user,
        type: req.body.type,
        message: req.body.message,
        date: new Date().toISOString(),
    });
    notification.save().then(doc => {
        res.status(200).json(doc);
    }).catch(err => {
        res.status(500).json({ error: err });
    });
}

export function deleteById(req, res) {
    Notification.findByIdAndDelete(req.params.id).then(doc => {
        res.status(200).json(doc);
    }).catch(err => {
        res.status(500).json({ error: err });
    });
}

export function updateById(req, res) {
    Notification.findByIdAndUpdate(req.params.id, req.body).then(doc => {
        res.status(200).json(doc);
    }
    ).catch(err => {
        res.status(500).json({ error: err });
    }
    );
}

export function getById(req, res) {
    Notification.findById(req.params.id).then(doc => {
        res.status(200).json(doc);
    }).catch(err => {
        res.status(500).json({ error: err });
    });
}

export function getByUser(req, res) {

    Notification.find({ user: req.params.id }).then(doc => {
        res.status(200).json(doc);
    }).catch(err => {
        res.status(500).json({ error: err });
    });

}

export function getByType(req, res) {

    Notification.find({ type: req.params.type }).then(doc => {
        res.status(200).json(doc);
    }).catch(err => {
        res.status(500).json({ error: err });
    });

}

export function getByDate(req, res) {

    Notification.find({ date: new Date(req.params.date).toISOString() }).then(doc => {
        res.status(200).json(doc);
    })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

