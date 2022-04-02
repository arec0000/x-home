FROM node
# создание директории приложения
WORKDIR /usr/src/server
# установка зависимостей
# символ астериск ("*") используется для того чтобы по возможности
# скопировать оба файла: package.json и package-lock.json
COPY package*.json ./
RUN npm install
# копируем исходный код
COPY . .
EXPOSE 3000 5000 27017
CMD [ "node", "index.js" ]
