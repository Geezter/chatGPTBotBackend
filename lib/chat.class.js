import openai from '../config/open-ai.js';
import Message from './messages.class.js';

class Chat {

    constructor(userEmail) {
        this.userEmail = userEmail
        const chatHistory = []; // Store conversation history

        this.loadChatHistory = async () => {
            try {
                const messenger = new Message(this.userEmail)
                const rows = await messenger.getMessages()
                if (rows) {
                    chatHistory.push(
                    ...rows.map(row => ['user', row.message]), // Push user's message
                    ...rows.map(row => ['assistant', row.response]) // Push assistant's response
                    );
                }
            } catch (error) {
                console.error('Error loading chat history:', error)
            }
            return chatHistory
        }

        this.addMessage = async (message) => {
            chatHistory.push(['user', message])
        }

        this.returnAnswer = async () => {
            // get message history from database
            const messages = chatHistory.map(([role, content]) => ({ role, content, }))
            // create database row with the user input
            const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const latestMessage = messages[messages.length-1].content
            const messenger = new Message(this.userEmail)
            
            // get chatGPT answer
            const completion = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: messages,
            });
            const now2 = new Date().toISOString().slice(0, 19).replace('T', ' ');
            // save chatGPT answer
            const completionText = completion.data.choices[0].message.content
            await messenger.storeMessage(latestMessage, completionText, now, now2)
            //await messenger.updateMessage( latestMessage)
            
            return completionText
        }
    }
}
export default Chat
