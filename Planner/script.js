/**
 * Состояние приложения (State Management)
 */
let state = {
    lives: 3,
    investedAmount: 0,
    isSubscribed: false,
    tasks: []
};

/**
 * Навигация между экранами
 * @param {string} screenId - ID элемента, который нужно показать
 */
function showScreen(screenId) {
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');


});
    // Показываем нужный
    document.getElementById(screenId).classList.add('active');
}

/**
 * Регистрация пользователя
 */
function auth() {
    const nameInput = document.getElementById('reg-name').value;
    const emailInput = document.getElementById('reg-email').value;

    if (nameInput.length < 2 || !emailInput.includes('@')) {
        alert("Пожалуйста, введите корректные данные");
        return;
    }

    console.log(`Пользователь ${nameInput} авторизован`);
    showScreen('screen-planner');
}

/**
 * Переключение подписки
 * Логика: при активации добавляется 10% от 399р (39.9р) на инвест-счет
 */
function toggleSubscription() {
    state.isSubscribed = !state.isSubscribed;
    
    const subBtn = document.getElementById('sub-btn');
    const subStatus = document.getElementById('sub-status');

    if (state.isSubscribed) {
        subBtn.classList.add('active');
        subStatus.innerText = "Активна";
        state.investedAmount += 39.9; // 10% от 399
    } else {
        subBtn.classList.remove('active');
        subStatus.innerText = "Не активна";
    }

    updateUI();
}

/**
 * Добавление новой задачи
 */
function addTask() {
    const textInput = document.getElementById('task-input');
    const dateInput = document.getElementById('date-input');

    if (!textInput.value || !dateInput.value) {
        alert("Заполните название и дату!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: textInput.value,
        deadline: dateInput.value
    };

    state.tasks.push(newTask);
    
    // Очистка полей
    textInput.value = "";
    dateInput.value = "";

    updateUI();
}

/**
 * Выполнение задачи (Успех)
 */
function completeTask(id) {
    state.tasks = state.tasks.filter(task => task.id !== id);
    updateUI();
}

/**
 * Пропуск задачи (Потеря жизни)
 */
function failTask(id) {
    state.lives -= 1;
    state.tasks = state.tasks.filter(task => task.id !== id);

    if (state.lives <= 0) {
        showScreen('screen-over');
    }

    updateUI();
}

/**
 * Обновление визуального интерфейса на основе текущего состояния (State)
 */
function updateUI() {
    // Обновляем счетчики
    document.getElementById('lives-count').innerText = state.lives;
    document.getElementById('invest-sum').innerText = state.investedAmount.toFixed(1);

    // Рендерим список задач
    const listContainer = document.getElementById('task-list');
    listContainer.innerHTML = "";

    if (state.tasks.length === 0) {
        listContainer.innerHTML = `<p style="text-align:center; color:#94a3b8;">Задач пока нет</p>`;
    }

    state.tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <div class="task-info">
                <strong>${task.text}</strong>
                <small>Дедлайн: ${task.deadline}</small>
            </div>
            <div class="task-actions">
                <button class="btn-check" onclick="completeTask(${task.id})">✓</button>
                <button class="btn-fail" onclick="failTask(${task.id})">✕</button>
            </div>
        `;
        listContainer.appendChild(taskElement);
    });
}