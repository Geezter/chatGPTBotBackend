import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import User from './lib/user.class.js';
import readlineSync from 'readline-sync';


server.post('/api/register', async (req, res) => {
    console.log(req.body);
    const username = req.body.username;
    const userEmail = req.body.email; 
    let userSaveResponse
    try {
        const user = new User(userEmail)
        await user.saveUser(username)
    } catch (error) {
        console.log('error inc');
        return { message: error }
        //res.status(500).send('An error occurred');
    }
    console.log('true incoming')
    res.json({message: ok });
});

server.post('/api/verify', async (req, res) => {
    console.log('verifying in node')
    const userInputVerificationCode = req.body.code
    const userEmail = req.body.email
    try {
        const user = new User(userEmail)
        await user.checkVerification(userInputVerificationCode)
    } catch (error) {
        res.json({ message: error});
    }
    

    res.json({ message: 'token'});
}) 

