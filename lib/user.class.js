import pool from '../config/db.js'
import jwt from 'jsonwebtoken'
import transporter from '../config/nodeMailer.js'

class User {
  constructor(email = null) {
    this.email
    if (email) {
      this.email = email
    }
  }
  
  async createUser(email) {
    const query = `INSERT INTO user 
      (email, created_at) SELECT ?, NOW()
      FROM dual
      WHERE NOT EXISTS (SELECT 1 FROM user WHERE email = ?)
    `
  try {
    const [results] = await pool.promise().execute(query, [email, email])
    
    if (results && results.affectedRows > 0) {
      return 'success';
    } else {
      return 'Error creating user: User with the same email already exists.';
    }
  } catch (error) {
    console.error(error);
    // Handle the error appropriately, e.g., return an error message or rethrow the error.
  }
}

  async sendVerifyRequest() {
    try {

      if (results && results.affectedRows > 0) {
        console.log('User edited successfully.');
        await this.sendVerificationEmail(this.email);
        return {message: 'ok'}
      } else {
        return 'Error creating user: No rows affected.'
      }
    } catch (error) {
        console.error('Error creating user:', error.message);
        return error
    }
  }
  
  async checkDoesUserExist(email) {
    try {
      const [rows] = await pool.promise().query('SELECT * FROM user WHERE email = ?', [email])
      return Boolean(rows.length) && rows[0]; // Email is unique, return the first (and only) result, or false
    } catch (error) {
      console.error('Error fetching user by email:', error.message)
      throw error // Handle the error or rethrow it based on your requirements
    }
  }
      

  async sendVerificationEmail() {
    // Generate a random verification code
    async function generateVerificationCode() {
      return Math.floor(100000 + Math.random() * 900000);
    }

    // Generate verification code
    const verificationCode = await generateVerificationCode();
    // Generate verification code expiration timestamp
    const verificationCodeExpiration = new Date(Date.now() + 15 * 60 * 1000);

    const mailOptions = {
      from: 'DO_NOT_REPLY@gentlybot.com', // Sender email address
      to: this.email, // Recipient email address
      subject: 'Varmistuskoodi HerraBotille',
      text: `Hei ${this.email}, kirjautumiskoodisi on: ${verificationCode}. \n Vanhenee ${verificationCodeExpiration}`,
    };
  
    try {
      await transporter.sendMail(mailOptions)
      console.log('Verification email sent successfully.')

      const query = `
      UPDATE user
      SET verification_code = ?, verification_code_expiration = ?, edited_at = NOW()
      WHERE email = ?;
      `;
      const values = [verificationCode, verificationCodeExpiration, this.email]
      try {
        await pool.promise().execute(query, values)
        console.log('Verification code and expiration date added successfully.')
        return true
      } catch (error) {
        console.error('Error updating verification code and  verification expiration date:', error.message)
        return false
      }
      } catch (error) {
      console.error('Error sending verification email:', error)
      return false
      }
  }

  
  async checkVerification(userInputVerificationCode) {
    const user = await this.getUserByEmail(this.email)
    
    // Check if the user exists and the verification code is correct
    if (user.verification_code !== userInputVerificationCode || user.verification_code_expiration < new Date()) {
      //return res.status(401).json({ message: 'Invalid or expired verification code.' })
      return 'no'
    }

    if (!await this.updateUserVerification(this.email)) {
      //return res.status(401).json({ message: 'Cannot update the user table with verification date.' });
      return 'not'
    }
    return true
  }

  async createToken(userEmail) {
    const token = jwt.sign({ userEmail }, process.env.TOKEN_SECRET_KEY, { expiresIn: '30days' });
    return token
  }

  async checkIsUserEmailVerified(email) {
    try {
      const query = 'SELECT * FROM user WHERE email = ?'
      const values = [email]
      const result = await pool.promise().execute(query, values)
  
      return result[0][0].email_verified_at != null;  // Check if there is a match
    } catch (error) {
      console.error('Error checking user verification:', error)
      return false; // Query failed
    }
  }

  async updateUserVerification(email) {
    try {
      pool.query('UPDATE user SET email_verified_at = NOW() WHERE email = ?', [email]);
      return true; // Update successful
    } catch (error) {
      console.error('Error updating user verification:', error);
      return false; // Update failed
    }
  }

  // Function to fetch user information by email
  async getUserByEmail(email) {
    try {
      const [rows] = await pool.promise().query('SELECT * FROM user WHERE email = ?', [email]);
      return rows[0]; // Email is unique, return the first (and only) result
    } catch (error) {
      console.error('Error fetching user by email:', error.message);
      throw error; // Handle the error or rethrow it based on your requirements
    }
  }
}

export default User