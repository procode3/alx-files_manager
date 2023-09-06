// utils/redis.js
const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    // Listen for errors and log them to the console
    this.client.on('error', (error) => {
      console.error('Redis Error:', error);
    });
  }

  isAlive() {
    // Check if the client is connected to Redis
    return this.client.connected;
  }

  async get(key) {
    const value = await this.client.get(key)
    return value
  } 
  
  async set(key, value, duration) {
    await this.client.set(key, value, {
      EX: duration
    })
  }
  async del(key) {
    await this.client.del(key)
  }

}
const redisClient = new RedisClient()

module.exports = redisClient;

