// scanner-listener-100-percent.js

const rustcatch = require('rustcatch');

// --- НАСТРОЙКИ ---
const INPUT_TIMEOUT_MS = 300; // Пауза для сброса буфера

// --- ЛОГИКА ПРОГРАММЫ ---
let inputBuffer = '';
let inputTimeout = null;

function resetInput() {
    inputBuffer = '';
    clearTimeout(inputTimeout);
}

// Карта символов, основанная на вашем логе.
// Для клавиш с двумя символами (например, / и ?) мы используем массив.
const KEY_MAP = {
    // Буквы (всегда в нижнем регистре)
    'KeyA': 'a', 'KeyB': 'b', 'KeyC': 'c', 'KeyD': 'd', 'KeyE': 'e', 'KeyF': 'f', 'KeyG': 'g', 'KeyH': 'h', 'KeyI': 'i', 'KeyJ': 'j', 'KeyK': 'k', 'KeyL': 'l', 'KeyM': 'm', 'KeyN': 'n', 'KeyO': 'o', 'KeyP': 'p', 'KeyQ': 'q', 'KeyR': 'r', 'KeyS': 's', 'KeyT': 't', 'KeyU': 'u', 'KeyV': 'v', 'KeyW': 'w', 'KeyX': 'x', 'KeyY': 'y', 'KeyZ': 'z',
    // Верхний ряд цифр
    'Digit0': ['0', ')'], 'Digit1': ['1', '!'], 'Digit2': ['2', '@'], 'Digit3': ['3', '#'], 'Digit4': ['4', '$'], 'Digit5': ['5', '%'], 'Digit6': ['6', '^'], 'Digit7': ['7', '&'], 'Digit8': ['8', '*'], 'Digit9': ['9', '('],
    // Цифровой блок (Numpad)
    'Num0': '0', 'Num1': '1', 'Num2': '2', 'Num3': '3', 'Num4': '4', 'Num5': '5', 'Num6': '6', 'Num7': '7', 'Num8': '8', 'Num9': '9',
    'NumpadDecimal': '.', 'NumpadAdd': '+', 'NumpadSubtract': '-', 'NumpadMultiply': '*', 'NumpadDivide': '/',
    // Символы
    'Minus': ['-', '_'], 'Equal': ['=', '+'], 'Semicolon': [';', ':'], 'Quote': ["'", '"'], 'Comma': [',', '<'], 'Period': ['.', '>'], 'Slash': ['/', '?'],
    // Пробел
    'Space': ' ',
};

// Ваш сканер использует 'Dot' для символа '>'. Добавим это как особый случай.
KEY_MAP['Dot'] = KEY_MAP['Period'];

let isShiftPressed = false;

// Мы будем обрабатывать только 'keydown', чтобы 'keyup' нам не мешал.
rustcatch.on('keydown', (event) => {
    clearTimeout(inputTimeout);

    const key = event.key;

    // 1. Конец ввода
    if (key === 'Return' || key === 'Enter') {
        if (inputBuffer.length > 0) {
            console.log(inputBuffer);
        }
        resetInput();
        return;
    }

    // 2. Отслеживаем нажатие Shift
    if (key === 'ShiftLeft' || key === 'ShiftRight') {
        isShiftPressed = true;
        // Важно: устанавливаем таймаут и для Shift, чтобы он не "залипал"
        inputTimeout = setTimeout(resetInput, INPUT_TIMEOUT_MS);
        return;
    }

    let entry = KEY_MAP[key];
    let char = '';

    // 3. Если клавиша найдена в нашей карте
    if (entry) {
        if (Array.isArray(entry)) {
            // Клавиша с двумя символами
            char = isShiftPressed ? entry[1] : entry[0];
        } else {
            // Обычная буква
            char = isShiftPressed ? entry.toUpperCase() : entry;
        }
        inputBuffer += char;
    }
    // Если клавиша НЕ найдена (например, 'Unknown', 'ControlLeft'),
    // мы ее просто ИГНОРИРУЕМ. Буфер НЕ сбрасывается.

    // 4. Устанавливаем таймер сброса
    inputTimeout = setTimeout(resetInput, INPUT_TIMEOUT_MS);
});

// Отслеживаем отпускание Shift, чтобы он не оставался "нажатым"
rustcatch.on('keyup', (event) => {
    if (event.key === 'ShiftLeft' || event.key === 'ShiftRight') {
        isShiftPressed = false;
    }
});


// --- ЗАПУСК И ОСТАНОВКА ---
console.log('Слушатель сканера (версия из лога) запущен. Ожидание сканирования...');
console.log('Нажмите Ctrl+C для выхода.');

try {
    rustcatch.start();
} catch (error) {
    console.error('Не удалось запустить слушатель:', error.message);
    process.exit(1);
}

setInterval(() => {}, 1000 * 60 * 60);

process.on('SIGINT', () => {
    if (rustcatch.isRunning) {
        rustcatch.stop();
        console.log('\nСлушатель остановлен.');
    }
    process.exit(0);
});