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
    return this.database.getCollection('users').length
  }

  async nbFiles() {
    await this.client.connect();
    return this.database.getCollection('files').length
  }
}

const dbClient = new DBClient();

export { dbClient };
