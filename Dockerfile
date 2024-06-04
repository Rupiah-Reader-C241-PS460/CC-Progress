FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=prod

COPY . .

ENV PORT=3000

ENV MODEL_URL=https://storage.googleapis.com/submission-mlgc45/submissions-model/model.json

CMD ["npm", "start"]