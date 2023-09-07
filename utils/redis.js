import redis from 'redis'


class RedisClient {
  constructor() {
    this.client = redis.createClient();

    // Listen for errors and log them to the console
    this.client.on('error', (error) => {
      console.error('Redis Error:', error);
    });
    this.connected = false;

    this.client.on('connect', () => {
      this.connected  = true;
    });

  }

  isAlive() {
    return this.connected;
  }  
  

  setTimeout(this.isAlive, 3000);
 
  async get(key) {
    try {
      const value = await new Promise((resolve, reject) => {
        this.client.get(key, (err, reply) => {
          if (err) {
            console.error('Redis Get Error:', err);
            reject(err);
          } else {
            resolve(reply);
          }
        });
      });
      return value;
    } catch (error) {
      console.error('Redis Get Error:', error);
      throw error;
    }
  }

  async set(key, value, duration) {
    try {
      await new Promise((resolve, reject) => {
        this.client.set(key, value, 'EX', duration, (err) => {
          if (err) {
            console.error('Redis Set Error:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('Redis Set Error:', error);
      throw error;
    }
  }

  async del(key) {
    try {
      await new Promise((resolve, reject) => {
        this.client.del(key, (err) => {
          if (err) {
            console.error('Redis Delete Error:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('Redis Delete Error:', error);
      throw error;
    }
  }

 

}
const redisClient = new RedisClient()

module.exports = redisClient;

