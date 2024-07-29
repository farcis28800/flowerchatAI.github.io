document.addEventListener("DOMContentLoaded", () => {
    const splash = document.getElementById("splash");
    const chatContainer = document.getElementById("chat-container");
    const sendButton = document.getElementById("send-button");
    const userInput = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const sideMenu = document.getElementById("side-menu");
    const menuButton = document.getElementById("menu-button");
    const closeButton = document.querySelector(".menu-button");
  
    // Задержка для показа заставки и анимации
    setTimeout(() => {
        splash.style.opacity = "0";
        setTimeout(() => {
            splash.style.display = "none";
            chatContainer.style.opacity = "1"; // Показываем контейнер чата
        }, 500); // 500ms - время перехода
    }, 2000); // 2000ms - задержка показа заставки

    // Отправка сообщений
    function sendMessage() {
        const messageText = userInput.value.trim();
        if (messageText === "") return;
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", "user");
        messageElement.textContent = messageText;
        chatBox.appendChild(messageElement);
        userInput.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;

        // Ответ от бота (например, через 1 секунду)
        setTimeout(() => {
            const botMessageElement = document.createElement("div");
            botMessageElement.classList.add("message", "bot");
            botMessageElement.textContent = "Сервер пока что не доступе :(";
            chatBox.appendChild(botMessageElement);
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 1000);
    }

    // Событие для кнопки отправки
    sendButton.addEventListener("click", sendMessage);

    // Событие для клавиши Enter
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    // Открытие бокового меню
    menuButton.addEventListener("click", () => {
        sideMenu.style.left = "0";
    });

    // Закрытие бокового меню
    closeButton.addEventListener("click", () => {
        sideMenu.style.left = "-250px";
    });

    // Свайпы для открытия/закрытия меню
    let touchstartX = 0;
    let touchendX = 0;

    document.addEventListener("touchstart", (event) => {
        touchstartX = event.changedTouches[0].screenX;
    });

    document.addEventListener("touchend", (event) => {
        touchendX = event.changedTouches[0].screenX;
        handleSwipeGesture();
    });

    function handleSwipeGesture() {
        if (touchendX < touchstartX - 50) {
            // Свайп влево для закрытия меню
            sideMenu.style.left = "-250px";
        }
        if (touchendX > touchstartX + 50) {
            // Свайп вправо для открытия меню
            sideMenu.style.left = "0";
        }
    }
});
