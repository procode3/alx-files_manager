const { MongoClient, ObjectID } = require('mongodb');
const sha1 = require('sha1');

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';

    this.url = `mongodb://${this.host}:${this.port}`;
    this.client = new MongoClient(this.url, { useUnifiedTopology: true });
    this.connected = false;
    this.client
      .connect()
      .then(() => {
        this.connected = true;
      })
      .catch((err) => console.error(err));
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    await this.client.connect();
    const users = await this.client
      .db(this.database)
      .collection('users')
      .countDocuments();

    return users;
  }

  async nbFiles() {
    await this.client.connect();
    const files = await this.client
      .db(this.database)
      .collection('files')
      .countDocuments();

    return files;
  }

  async createUser(email, password) {
    await this.client.connect();

    const hashedPwd = sha1(password);

    const data = await this.client
      .db(this.database)
      .collection('users')
      .insertOne({
        email,
        password: hashedPwd,
      });

    return data.insertedId.toString();
  }

  async findUser(...params) {
    await this.client.connect();

    const [email, password] = params;

    const user = await this.client
      .db(this.database)
      .collection('users')
      .findOne({
        email,
        password,
      });

    return user;
  }

  async findUserById(id) {
    await this.client.connect();

    const _id = new ObjectID(id);

    const user = await this.client
      .db(this.database)
      .collection('users')
      .findOne({
        _id,
      });

    return user;
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
