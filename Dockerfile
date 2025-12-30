# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app/backend

# Copy package.json and package-lock.json (or yarn.lock)
# to install dependencies
COPY backend/package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY backend/ .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]
