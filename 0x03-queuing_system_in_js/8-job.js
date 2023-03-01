function createPushNotificationsJobs(jobs, queue) {
    if (!Array.isArray(jobs)) {
        throw new Error('Jobs is not an array')
    }

    jobs.forEach((job) => {
        const jobNotification = queue.create('push_notification_code_3', job);

        jobNotification.on('created', () => {
            console.log(`Notification job created: ${jobNotification.id}`);
        })
        .on('complete', () => {
            console.log(`Notification job ${jobNotification.id} completed`);
        })
        .on('failed', (error) => {
            console.log(`Notification job ${jobNotification} failed: ${error}`);
        })
        .on('progress', (progress, data) => {
            console.log(`Notification job ${jobNotification} ${progress}% complete`);
        });

        jobNotification.save()
    });
};

module.exports = createPushNotificationsJobs;
