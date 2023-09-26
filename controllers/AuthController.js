const sha1 = require('sha1');
const { v4: uuidv4 } = require('uuid');
const db = require('../utils/db');
const redis = require('../utils/redis');

const controller = {
  getConnect: async (req, res) => {
    const auth = req.headers.authorization.split(' ')[1];
    const [email, password] = Buffer.from(auth, 'base64').toString().split(':');

    const user = await db.findUser(email, sha1(password));

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
    } else {
      const token = uuidv4();
      const key = `auth_${token}`;

      await redis.set(key, user._id, 86400);
      res.status(200).json({ token });
      res.end();
    }
  },

  getDisconnect: async (req, res) => {
    const token = req.headers['x-token'];

    const key = `auth_${token}`;
    const id = await redis.get(key);
    const user = await db.findUserById(id);

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
    } else {
      await redis.del(key);
      res.status(204).json();
    }
  },
};

module.exports = controller;
