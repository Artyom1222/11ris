FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Сделаем скрипт запуска исполняемым
RUN chmod +x ./start.sh

EXPOSE 4000

CMD ["./start.sh"]
