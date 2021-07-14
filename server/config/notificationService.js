const Notification = require('../models/Notification');

module.exports.sendNotification = (data) => {
    const { title, message, user, createdBy } = data
    // console.log({ title, message, user, createdBy });
    return new Promise((resolve, reject) => {
        try {
            const notification = new Notification({ title, message, user, createdBy })
            notification.save()
                .then(result => resolve(result))
                .catch(error => reject(error))
        } catch (err) {
            console.log(err);
            reject(error);
        }
    })
}
