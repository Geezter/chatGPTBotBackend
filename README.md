Node.js backend for ChatGPT.


Node.js backend with MySQL database. They both run on same docker container. These are the key concepts to the service.

There is server.js file which is the backbone of the whole service. There are 5 endpoints in it:


'/api/handshake'

Recieves token.
When user starts the app, front end sends a handhshake post to backend. When backend receives this, it can do 3 things:

	1. If handshake contains valid JWT token, it reads it and if it gets from it e-mail which is found from the database, 
	it checks out if the user account is verified with email. If verification is done, backend returns email message ’ok’.
	
	2. If user needs to be verified, it returns email and message ’verify’

	3. If email is not found or token is invalid, it returns ’register’.	

'/api/getmessages'

Recieves token and returns all messages of the user.


'/api/chatgpt'

Recieves token and user input. If user input is ’/clear’, deletes all messages for the user. 
Otherways directs the message to chatGPT. Always directs last 10 messages to the ChatGPT, if there are so many.
10 messages is the maximum.
Returns chatGPT answer to front when received.


'/api/login'

Login. This is like the registering part. Recieves registration email, forms a JWT token of it. Creates user in user table and
Sends verification email to the email and saves the same verification code to users database row. After all this returns the JTW token to the front.


'/api/verify'

Recieves token and verification code. If the verification code matches with the one on the user’s database row, verifies user.
Basically after this user can ask stuff from chatGPT.