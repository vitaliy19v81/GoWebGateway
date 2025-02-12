self.addEventListener('push', function(event) {
    const message = event.data.text(); // Получаем текст сообщения

    const options = {
        body: message,
        data: {
            message,  // Сообщение
            url: '/push_input'  // URL для перехода
        },
        requireInteraction: true // Уведомление останется, пока пользователь его не закроет false // Позволяет закрывать уведомление программно

    };

    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );

});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();  // Закрыть уведомление

    const data = event.notification.data;  // Получаем данные из уведомления
    console.log('Notification data:', data);  // Логируем данные уведомления

    const url = data.url || '/push_input';  // Если URL не передан, по умолчанию переходим на '/push_input'

    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
            for (let client of clientList) {
                if (client.url.includes(url) && 'focus' in client) {
                    console.log("Отправка push-сообщения в открытую вкладку:", data.message);
                    client.postMessage(data.message); // Отправляем сообщение в открытую страницу
                    return client.focus();
                }
            }
            // Если вкладка не открыта, открываем и передаем данные
            return self.clients.openWindow(url).then(client => {
                if (client) {
                    console.log("Открыта новая вкладка и передано сообщение:", data.message);
                    client.postMessage(data.message);
                }
            });
        })
    );
});
