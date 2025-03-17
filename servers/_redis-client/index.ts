import redis from 'redis';
const client = redis.createClient();
client.connect();

export default client;
