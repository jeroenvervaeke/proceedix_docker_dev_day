# Create a new base image based on nodejs v8 (alpine edition)
FROM node:8-alpine

# Set our working directory
WORKDIR /usr/src/app

# Copy the json & json.lock file
# We do this first to speed up compilation times
COPY package*.json ./

# Install the application
RUN npm install

# Copy the source code (.) to our working directory (.)
COPY . .

# We'll expose port 80
EXPOSE 80

# Run "npm start" to start the actual application
CMD [ "npm", "start"]