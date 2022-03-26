/*
    Для решения проблем с перерисовкой компонентов, вынес вебсокет в отдельный модуль
    Функционал:
        - chanel - ссылка на экземпляр класса WebSocket, можно использовать метод send
        - connect(onMessage) - запускает процесс подключения, в качестве аргумента функция, которая
          будет вызываться при получении сообщения, она получает объект события в качестве аргумента
        - При подключении отправляет авторизационное сообщение
*/
class Socket {
    connect(onMessage) {
        const socket = new WebSocket('ws://localhost:5000');

        socket.addEventListener('open', () => {
            this.chanel = socket;
            socket.send(JSON.stringify({title: 'authentication', id: 'app'}));
            console.log('Подлкючение установлено');
        });

        socket.addEventListener('message', onMessage);

        socket.addEventListener('close', e => {
            if (e.wasClean) {
                console.log('Соединение закрыто');
            } else {
                console.log('Соединение прервано');
            }
            setTimeout(() => this.connect(onMessage), 3000);
        });

        socket.addEventListener('error', err => {
            console.error(`Ошибка: ${err.message}`);
            socket.close();
        });
    }
}

export default new Socket();
