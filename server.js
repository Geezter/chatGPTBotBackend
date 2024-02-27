import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import Chat from './lib/chat.class.js'
import User from './lib/user.class.js'
import verifyUser from './config/jwt.js'
import Message from './lib/messages.class.js';

const server = express();
const port = 3000;
server.use(bodyParser.json());
server.use(cors());

server.post('/api/handshake', async (req, res) => {
    try {
        const token = req.body.token
        if (token) {
            const userEmail = await verifyUser(token)
            const user = new User(userEmail)
            //await user.createUser()
            const userVerified = await user.checkIsUserEmailVerified(userEmail)
            if (!userVerified) {
                await user.sendVerificationEmail()
                res.send(JSON.stringify({ email: user.email, message: 'verify' }))
                return
            }
            res.send(JSON.stringify({ email: userEmail, message: 'ok' }))
            return
        }
        res.send(JSON.stringify({ email: 'none', message: 'register' }))
    } catch (error) {
        console.error('Error in handshake ', error)
    }
})

server.post('/api/getmessages', async (req, res) => {
    try {
        const token = req.body.token
        if (token) {
            const userEmail = await verifyUser(token)
            const user = new User(userEmail)
            const userVerified = await user.checkIsUserEmailVerified(userEmail)
            if (userVerified) {
             
                const messenger = new Message(userEmail)
                const rows = await messenger.getMessages()
                res.send(JSON.stringify({ rows }))
                return
            }
        }
    } catch (error) {
        console.error('Error in handshake ', error)
    }
})

server.post('/api/chatgpt', async (req, res) => {
    const userInput = req.body.prompt
    const token = req.body.token
    const userEmail = await verifyUser(token)
    if (userInput === '/clear') {
        const messenger = new Message(userEmail)
        console.log(userEmail)
        await messenger.deleteMessages()
        res.send(JSON.stringify('deleted'))
        return
    }
    try {
        const chatInstance = new Chat(userEmail)
        await chatInstance.loadChatHistory()
        chatInstance.addMessage(userInput)
        let chatResult = await chatInstance.returnAnswer()
        const chatResultInJson = JSON.stringify(chatResult)
        res.send(chatResultInJson)
        return
    } catch (error) {
        console.error(error)
        res.status(500).send('An error occurred')
    }
})

server.post('/api/login', async (req, res) => {
    let token
    const userEmail = req.body.email
    try {
        const user = new User(userEmail)
        token = await user.createToken(userEmail)
        await user.createUser(userEmail)
        await user.sendVerificationEmail()
    } catch (error) {
        console.error(error)
        res.status(500).send({ error })
        return
    }
    console.log(token)
    res.json({ 'token': token, 'useremail': userEmail })
})

server.post('/api/verify', async (req, res) => {
    const userInputVerificationCode = req.body.code
    const userEmail = req.body.email
    try {
        const user = new User(userEmail)
        const response = await user.checkVerification(userInputVerificationCode)
        const token = await user.createToken(userEmail)
        if (response === 'no' || response === 'not') {
            res.json({ message: 'failed' })
            return
        }
        res.json({ message: token })
    } catch (error) {
        res.json({ message: error })
    }
}) 

server.listen(port, () => {
    console.log('ChatGPT API listening on port 3000')
})
