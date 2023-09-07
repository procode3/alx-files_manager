import { MongoClient } from 'mongodb';


class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    const uri = `mongodb://${host}:${port}/${database}`;
    this.client = new MongoClient(uri, {
      userNewUrlParse: true,
      useUnifiedTopology: true });
    }


  async isAlive() {
    try {
      await this.client.connect();
      return true;
    }
    catch{
      return false;
    }
    finally {
      this.client.close();
    }
  }



  async nbUsers() {
    await this.client.connect();
    const users = await this.client.db(this.database).collection('users').countDocuments();
    return users
  }

  async nbFiles() {
    await this.client.connect();
    const files = await this.client.db(this.database).collection('files').countDocuments();
    return files
  }
}

const dbClient = new DBClient();

export { dbClient };
