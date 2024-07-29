document.addEventListener('DOMContentLoaded', () => {
    // Скрин-заставка
    const splashScreen = document.getElementById('splash');
    const chatContainer = document.getElementById('chat-container');

    setTimeout(() => {
        splashScreen.style.opacity = '0';
        setTimeout(() => {
            splashScreen.style.display = 'none';
            chatContainer.classList.remove('hidden');
            loadChatHistory(); // Загружаем историю чата после заставки
        }, 2000); // Убедитесь, что задержка соответствует времени анимации
    }, 2000); // Задержка перед скрытием заставки

    // Функция отправки сообщения
    document.getElementById('send-button').addEventListener('click', sendMessage);
    document.getElementById('user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const userInput = document.getElementById('user-input');
        const messageText = userInput.value.trim();

        if (messageText) {
            appendMessage(messageText, 'user');
            saveMessage(messageText, 'user');
            userInput.value = '';

            try {
                // Отправка сообщения на сервер
                const response = await fetch('http://127.0.0.1:5000/message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: messageText })
                });
                const data = await response.json();
                appendMessage(data.response, 'bot');
                saveMessage(data.response, 'bot');
            } catch (error) {
                appendMessage('Ошибка связи с сервером.', 'bot');
                saveMessage('Ошибка связи с сервером.', 'bot');
            }
        }
    }

    function appendMessage(text, sender) {
        const chatBox = document.getElementById('chat-box');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = text;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function saveMessage(text, sender) {
        const messages = JSON.parse(localStorage.getItem('chatHistory')) || [];
        messages.push({ text, sender });
        localStorage.setItem('chatHistory', JSON.stringify(messages));
    }

    function loadChatHistory() {
        const messages = JSON.parse(localStorage.getItem('chatHistory')) || [];
        messages.forEach(msg => {
            appendMessage(msg.text, msg.sender);
        });
    }

    // Обработка бокового меню с использованием свайпа
let touchStartX = 0;
let touchEndX = 0;
const sideMenu = document.getElementById(‘side-menu’);

document.body.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.body.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX - touchStartX > 50) {
        openMenu();
    } else if (touchStartX - touchEndX > 50) {
        closeMenu();
    }
}

function openMenu() {
    sideMenu.style.left = '0';
}

function closeMenu() {
    sideMenu.style.left = '-250px';
}

// Кнопка закрытия меню
document.getElementById('close-menu').addEventListener('click', closeMenu);

// Регулировка положения поля ввода при появлении клавиатуры
const inputContainer = document.getElementById('input-container');

window.addEventListener('resize', () => {
    if (window.innerHeight < 600) { // Предполагаем, что клавиатура видима
        inputContainer.style.position = 'absolute';
        inputContainer.style.bottom = '60px'; // Настройте в зависимости от высоты клавиатуры
    } else {
        inputContainer.style.position = 'fixed';
        inputContainer.style.bottom = '0';
    }
});

