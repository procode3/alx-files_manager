const sha1 = require('sha1');
const db = require('../utils/db');
const redis = require('../utils/redis');

const controller = {
  postNew: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email) {
        res.status(400).json({ error: 'Missing email' });
        res.end();
        return;
      }
      if (!password) {
        res.status(400).json({ error: 'Missing password' });
        res.end();
        return;
      }

      const user = await db.findUser(email, sha1(password));

      if (user) {
        res.status(400).json({ error: 'Already exist' });
        res.end();
        return;
      }

      const userId = await db.createUser(email, password);

      res.status(201).json({ id: userId, email });
      res.end();
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  getMe: async (req, res) => {
    const token = req.headers['x-token'];

    const key = `auth_${token}`;
    const id = await redis.get(key);
    const user = await db.findUserById(id);

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
    } else {
      res.status(200).json({ id, email: user.email });
      res.end();
    }
  },
};

module.exports = controller;
