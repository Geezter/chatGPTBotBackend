import database from '../config/db.js';

class Message {

    constructor(userEmail) {
        this.sender = userEmail;
    
        this.storeMessage = async (userInput, response, messageCreatedAt, responseCreatedAt) => {
            try {
                const query = 'INSERT INTO messages (email, message, response, message_created_at, response_created_at) VALUES (?, ?, ?, ?, ?)'
                const values = [this.sender, userInput, response, messageCreatedAt, responseCreatedAt];
                await database.promise().execute(query, values)
            } catch (err) {
                console.error('Failed to store message:', err)
            }
        }

        this.updateMessage = async (answer, original) => {
            try {
                const query = 'UPDATE message SET response = ?, response_created_at = NOW() WHERE message = ?'
                const values = [answer, original]
                await database.promise().execute(query, values)
            } catch (error) {
              console.error('Error updating message:', error);
              return false
            }
          }
  
        this.getMessages = async () => {
            try {
                const query = 'SELECT * FROM messages WHERE email = ? ORDER BY message_created_at ASC LIMIT 10'
                const values = [this.sender]
                const [rows] = await database.promise().execute(query, values)
                return rows
            } catch (err) {
                console.error('Failed to retrieve messages:', err)
                return false
            }
        }

        this.deleteMessages = async () => {
            try {
                const query = 'DELETE FROM messages WHERE email = ?'
                const values = [this.sender]
                const [rows] = await database.promise().execute(query, values)
                return rows
            } catch (err) {
                console.error('Failed to delete messages:', err)
                return false
            }
        }
    }
}
  
export default Message;