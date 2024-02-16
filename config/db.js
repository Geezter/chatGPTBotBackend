import mysql2 from 'mysql2';
import fs from 'fs';

const pool = mysql2.createPool({
  host: '127.0.0.1',
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the MySQL database
/*pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');

  
});*/

const createTableUserScript = fs.readFileSync('./config/create_table_user.sql', 'utf8');
const createTableMessagesScript = fs.readFileSync('./config/create_table_messages.sql', 'utf8');


const createTables = async (script, tableName) => {
  pool.query(script, (error, results) => {
    if (error) {
      return console.error('Error creating user table:', error.message);
    }
    console.log(`${tableName} table created if it wasn't already made.`)
    return results
  });
}

await createTables(createTableUserScript, 'user')
await createTables(createTableMessagesScript, 'messages')




// Export the connection object
export default pool;