import { Client, Databases } from 'appwrite';

const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1')  // Appwrite Cloud endpoint
  .setProject(process.env.REACT_APP_PROJECT_ID);  // Your Project ID from Appwrite

const databases = new Databases(client);

export { client, databases };
