import redis from 'redis';
import { createClient } from 'redis';

const client = createClient();

client.on('connect', () => {
    console.log('Redis client connected to the server')
});

client.on('error', (error) => {
    console.log(`Redis client not connected to the server: ${error.message}`);
});

client.subscribe('holberton school channel');

client.on('message', (channel, message) => {
    console.log(`Received message ${message} on channel ${channel}`);

    if (message === 'KILL_SERVER') {
        client.unsubscribe('holberton school channel');
        client.quit();
    }
});
