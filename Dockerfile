FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=prod

COPY . .

ENV PORT=3000

ENV MODEL_URL=https://storage.googleapis.com/uangrupiah/tfjs_model_complete_pipeline/model.json

CMD ["npm", "start"]