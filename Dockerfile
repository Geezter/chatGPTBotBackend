# Use the official Ubuntu 20.04 base image
FROM ubuntu:20.04

# Update package lists and install necessary dependencies
RUN apt-get update && apt-get install -y curl

# Install Node.js 16.x
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

# Set the working directory inside the container
WORKDIR /var/www/html

# Specify a volume mount point
VOLUME ["/var/www/html"]

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port on which your Node.js application listens
EXPOSE 3000

# Start the Node.js application
CMD ["node", "server.js"]