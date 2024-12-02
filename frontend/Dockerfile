
FROM node:20

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json /app/

RUN npm install

COPY frontend /app

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

