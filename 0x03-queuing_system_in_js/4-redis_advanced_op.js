import redis from 'redis';
import { createClient } from 'redis';

const client = createClient();
// Connect to server
client.on('connect', () => {
    console.log('Redis client connected to the server')
});
//Log error message if connection fails
client.on('error', (error) => {
    console.log(`Redis client not connected to the server: ${error.message}`);
});

// Create hash
client.hset('HolbertonSchools', 'Portland', 50, redis.print);
client.hset('HolbertonSchools', 'Seattle', 80, redis.print);
client.hset('HolbertonSchools', 'New York', 20, redis.print);
client.hset('HolbertonSchools', 'Bogota', 20, redis.print);
client.hset('HolbertonSchools', 'Cali', 40, redis.print);
client.hset('HolbertonSchools', 'Paris', 2, redis.print);

// Display hash
client.hgetall('HolbertonSchools', (error, hash) => {
    if (error) {
        console.error(error);
    } else {
        console.log(hash);
    }
// Close redis client connection
    client.quit();
});
