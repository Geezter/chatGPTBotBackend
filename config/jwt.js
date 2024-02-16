import jwt from 'jsonwebtoken'

const verifyUser = async (token) => {
    let userEmail
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error('JWT verification failed:', err.message)
        } else {
            userEmail = decoded.userEmail        
        }
    })
    return userEmail
}

export default verifyUser
