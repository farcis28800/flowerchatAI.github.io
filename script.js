document.addEventListener('DOMContentLoaded', () => {
    // Элементы DOM
    const splashScreen = document.getElementById('splash');
    const chatContainer = document.getElementById('chat-container');
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const sideMenu = document.getElementById('side-menu');
    const closeMenuButton = document.getElementById('close-menu');
    const inputContainer = document.getElementById('input-container');

    // Показать загрузку на экране заставки
    const loadingText = document.createElement('div');
    loadingText.classList.add('loading-text');
    loadingText.textContent = 'Загрузка сообщений...';
    splashScreen.appendChild(loadingText);

    // Устанавливаем таймаут для скрытия заставки
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        setTimeout(() => {
            splashScreen.style.display = 'none';
            chatContainer.classList.remove('hidden');
            loadChatHistory();
        }, 500); // Время завершения анимации
    }, 2000); // Время заставки

    // Отправка сообщения
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    async function sendMessage() {
        const messageText = userInput.value.trim();

        if (messageText) {
            appendMessage(messageText, 'user');
            saveMessage(messageText, 'user');
            userInput.value = '';

            try {
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

    closeMenuButton.addEventListener('click', closeMenu);

    // Регулировка положения поля ввода при появлении клавиатуры
    window.addEventListener('resize', () => {
        if (window.innerHeight < 600) { // Предполагаем, что клавиатура видима
            inputContainer.style.position = 'absolute';
            inputContainer.style.bottom = '60px'; // Настройте в зависимости от высоты клавиатуры
        } else {
            inputContainer.style.position = 'fixed';
            inputContainer.style.bottom = '0';
        }
    });
});
