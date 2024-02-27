CREATE TABLE IF NOT EXISTS messages (
  message_id INT AUTO_INCREMENT PRIMARY KEY,
  chat_id int NOT NULL,
  email VARCHAR(36) NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  message_created_at DATETIME,
  response_created_at DATETIME,
  FOREIGN KEY (email) REFERENCES user(email)
);