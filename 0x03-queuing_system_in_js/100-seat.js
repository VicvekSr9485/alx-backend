const redis = require('redis');
const client = redis.createClient();
const { promisify } = require('util');
const kue = require('kue');
const queue = kue.createQueue();
const express = require('express');

const app = express();
const port = 1245;

const reserveSeat = async (number) => {
    await client.set('available_seats', number);
};

const getCurrentAvailableSeats = promisify(client.get).bind(client, 'available_seats');

reserveSeat(50);
let reservationEnabled = true;

app.get('/available_seats',  async (req, res) => {
    try {
        const availableSeats = await getCurrentAvailableSeats();
        res.send(`Number of available seats: ${availableSeats}`);
      } catch (err) {
        console.error(`Error getting number of available seats: ${err}`);
        res.sendStatus(500);
      }
})

app.get('/reserve_seat', async (req, res) => {
    if (!reservationEnabled) {
        res.json({ "status": "Reservations are blocked" });
    }
    const job = queue.create('reserve_seat').save((error) => {
        if (error) {
          console.error(`Error saving reserve_seat job to queue: ${error}`);
          return res.send({ "status": "Reservation failed" });
        }
    
        console.log(`reserve_seat job ${job.id} added to queue`);
        res.send({ "status": "Reservation in process" });
      });
    
      job.on('complete', (result) => {
        console.log(`Seat reservation job ${job.id} completed`);
      });
    
      job.on('failed', (error) => {
        console.error(`Seat reservation job ${job.id} failed: ${error}`);
      });
});

app.get('/process', async (req, res) => {
    res.json({ "status": "Queue processing" })

    queue.process('reserve_seat', async (job, done) => {
        const availableSeats = getCurrentAvailableSeats();
        const numSeats = parseInt(job.data.numSeats);

        if (numSeats > availableSeats) {
        return done(new Error('Not enough seats available'));
        }

    const newAvailableSeats = availableSeats - numSeats;
    await reserveSeat(newAvailableSeats);

    if (newAvailableSeats === 0) {
      reservationEnabled = false;
    }
    done();
    });

});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
