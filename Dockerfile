FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Accept build argument and set as environment variable
ARG SESSION_SECRET
ENV SESSION_SECRET=$SESSION_SECRET

RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]