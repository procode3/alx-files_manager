import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.connected = false;
    this.client.on('error', (error) => {
      console.error(error);
    });
    this.client.on('connect', () => {
      this.connected = true;
    });
  }

  isAlive() {
    return this.connected;
  }

  async get(key) {
    const getData = promisify(this.client.get).bind(this.client);
    let data;

    try {
      data = await getData(key);
    } catch (err) {
      console.error(err);
    }
    return data;
  }

  async set(key, value, duration) {
    const setData = promisify(this.client.set).bind(this.client);

    try {
      await setData(key, value, 'EX', duration);
    } catch (err) {
      console.error(err);
    }
  }

  async del(key) {
    const delData = promisify(this.client.del).bind(this.client);

    try {
      await delData(key);
    } catch (err) {
      console.error(err);
    }
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
