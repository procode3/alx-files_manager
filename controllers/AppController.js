const db = require('../utils/db');
const redis = require('../utils/redis');

const controller = {
  getStatus: (req, res) => {
    const redisAlive = redis.isAlive();
    const dbAlive = db.isAlive();

    if (redisAlive && dbAlive) {
      res.status(200).json({ redis: true, db: true });
    }
  },

  getStats: async (req, res) => {
    const users = await db.nbUsers();
    const files = await db.nbFiles();

    res.status(200).json({ users, files });
  },
};

module.exports = controller;
