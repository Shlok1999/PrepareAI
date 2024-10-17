import { Account, Client, Databases } from 'appwrite';
import questionData from './questionData';
const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1')  // Appwrite Cloud endpoint
  .setProject(process.env.REACT_APP_PROJECT_ID);  // Your Project ID from Appwrite

const databases = new Databases(client);

const databaseId = process.env.REACT_APP_DATABASE_ID;
const collectionId = process.env.REACT_APP_COLLECTION_ID_QUESTION

// const addQuestionsToAppwrite = async () => {
//   try {
//     for (let question of questionData) {
//       await databases.createDocument(
//         databaseId,
//         collectionId,
//         'unique()', // Generate unique ID for each document
//         {
//           question: question.question,
//           options: question.options,
//           correctAnswer: question.correctAnswer
//         }
//       );
//     }
//   } catch (error) {
//     console.error('Error adding questions:', error);
//   }
// };
// addQuestionsToAppwrite();

const account = new Account(client);

export { client, databases, account };
