const Notification = require('../models/Notification');

module.exports = {

    allNotifications: async (req, res) => {
        Notification.find({ user: req.params.id }, { title: 1, message: 1, createdAt: 1 }).sort({ createdAt: -1 })
            .then(result => { res.status(200).json({ success: true, message: 'Successfully get Notifications', payload: result }) })
            .catch(error => { res.status(400).json({ success: false, message: 'Error getting Notifications', payload: error }) })
    },

    createNotification: async (req, res) => {
        const { title, message, userId, createdBy } = req.body;
        if (!title, !message, !userId, !createdBy) {
            return res.status(400).json({ status: false, message: "Please fill all the field properly", payload: {} });
        }
        try {
            const notification = new Notification({ title, message, userId, createdBy })
            notification.save()
                .then(result => res.status(200).json({ success: true, message: 'Notification sent', payload: result }))
                .catch(error => res.status(400).json({ success: false, message: 'There is some error sending notification', payload: error }))
        } catch (err) {
            console.log(err);
            res.status(400).json({ status: false, message: 'Encountered some error', payload: err });
        }

    },

    getNotification: async (req, res) => {
        Notification.findOne({ _id: req.params.id }, { title: 1, message: 1 })
            .then(result => { res.status(200).json({ success: true, message: 'Successfully get Notification', payload: result }) })
            .catch(error => { res.status(400).json({ success: false, message: 'Error getting Notification', payload: error }) })
    },

    // ediNotifications: async (req, res) => {
    //     const { name, email, bio, phoneno, profession, dob, bname, bcode, accountno, accounttitle } = req.body;
    //     console.log({ name, email, bio, phoneno, profession, dob, bname, bcode, accountno, accounttitle });
    //     if (!name, !email, !phoneno, !dob, !profession, !bio, !bname, !bcode, !accountno, !accounttitle)
    //         return res.status(400).json({ success: false, message: 'Please Fill all the fields.', payload: {} })

    //     Organizer.findOneAndUpdate(
    //         { _id: req.params.id },
    //         { $set: { name: name, email: email, bio: bio, phoneno: phoneno, profession: profession, dob: dob, bname: bname, bcode: bcode, accountno: accountno, accounttitle: accounttitle } }
    //     )
    //         .then(org => res.status(200).json({ success: true, message: 'Successfully update Profile', payload: org }))
    //         .catch(error => { res.status(400).json({ success: false, message: 'Error updating Profile', payload: error }) })
    // },


}

