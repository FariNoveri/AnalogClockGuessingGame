const hourHand = document.querySelector('.hour-hand');
const minuteHand = document.querySelector('.minute-hand');
const timeInput = document.getElementById('timeInput');
const hourSelect = document.getElementById('hourSelect');
const minuteSelect = document.getElementById('minuteSelect');
const toggleInputModeButton = document.getElementById('toggleInputMode');
const inputContainer = document.querySelector('.input-container');
const dropdownContainer = document.querySelector('.dropdown-container');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popupMessage');
const scoreElement = document.getElementById('score');
const mistakesElement = document.getElementById('mistakes');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const mistakeList = document.getElementById('mistakeList');
const highscoreList = document.getElementById('highscoreList');
const timeIndicator = document.getElementById('timeIndicator');
const background = document.querySelector('.background');

const ENCRYPTION_KEY = 'FariIllyasvielNoveri';
let correctHour, correctMinute, score = 0, mistakes = 0, inputMode = 'text', mistakeHistory = [];

for (let i = 0; i <= 12; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i.toString().padStart(2, '0');
    hourSelect.appendChild(option);
}

for (let i = 0; i < 60; i += 5) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i.toString().padStart(2, '0');
    minuteSelect.appendChild(option);
}

const sceneryOptions = {
    morning: ['park', 'mountain', 'village'],
    day: ['beach', 'sea'],
    evening: ['mountain', 'hill', 'field'],
    night: ['city', 'suburb', 'kampung']
};

function createSceneryElements(type) {
    const existing = background.querySelectorAll('.sea, .beach, .scenery, .city, .suburb, .kampung, .person, .vehicle, .plant, .animal, .mist, .bird');
    existing.forEach(el => el.remove());

    // Pemandangan
    if (type === 'sea' || type === 'beach') {
        const scenery = document.createElement('div');
        scenery.className = `${type} show`;
        if (type === 'sea') {
            const wave = document.createElement('div');
            wave.className = 'wave';
            scenery.appendChild(wave);
        }
        background.appendChild(scenery);
    } else if (type === 'city' || type === 'suburb' || type === 'kampung') {
        const scenery = document.createElement('div');
        scenery.className = `${type} show`;
        const structures = type === 'city' ? ['building1', 'building2', 'building3'] : ['house1', 'house2'];
        const structureCount = Math.floor(Math.random() * structures.length) + 1;
        for (let i = 0; i < structureCount; i++) {
            const structure = document.createElement('div');
            structure.className = `${type === 'city' ? 'building' : 'house'} ${structures[i]}`;
            if (Math.random() > 0.4) {
                const windowCount = Math.floor(Math.random() * 3) + 1;
                for (let j = 0; j < windowCount; j++) {
                    const window = document.createElement('div');
                    window.className = `window window${j + 1}`;
                    structure.appendChild(window);
                }
            }
            scenery.appendChild(structure);
        }
        background.appendChild(scenery);
    } else {
        const scenery = document.createElement('div');
        scenery.className = `scenery ${type} show`;
        if (type === 'mountain') {
            const mist = document.createElement('div');
            mist.className = 'mist show';
            scenery.appendChild(mist);
        } else if (type === 'park' || type === 'village') {
            const birdCount = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < birdCount; i++) {
                const bird = document.createElement('div');
                bird.className = `bird bird${i + 1} show`;
                scenery.appendChild(bird);
            }
        }
        background.appendChild(scenery);
    }

    // Kendaraan
    const vehicles = {
        morning: ['bicycle', 'car'],
        day: ['boat'],
        evening: ['tractor', 'bicycle'],
        night: ['car', 'motorcycle']
    };
    const period = type === 'park' || type === 'mountain' || type === 'village' ? 'morning' :
                   type === 'beach' || type === 'sea' ? 'day' :
                   type === 'mountain' || type === 'hill' || type === 'field' ? 'evening' : 'night';
    const vehicleType = vehicles[period][Math.floor(Math.random() * vehicles[period].length)];
    if (Math.random() > 0.5) {
        const vehicle = document.createElement('div');
        vehicle.className = `vehicle ${vehicleType} show`;
        vehicle.style.left = `${Math.random() * 70 + 10}%`;
        background.appendChild(vehicle);
    }

    // Orang
    const people = {
        morning: ['walker'],
        day: ['swimmer', 'surfer'],
        evening: ['farmer', 'walker'],
        night: ['walker', 'sleeper']
    };
    const personType = people[period][Math.floor(Math.random() * people[period].length)];
    const personCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < personCount; i++) {
        const person = document.createElement('div');
        person.className = `person ${personType} show`;
        person.style.left = `${Math.random() * 70 + 10}%`;
        background.appendChild(person);
    }

    // Tumbuhan
    const plants = ['tree', 'grass', type === 'beach' ? 'palm' : 'tree'];
    const plantType = plants[Math.floor(Math.random() * plants.length)];
    const plantCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < plantCount; i++) {
        const plant = document.createElement('div');
        plant.className = `plant ${plantType} show`;
        plant.style.left = `${Math.random() * 80 + 5}%`;
        background.appendChild(plant);
    }

    // Hewan
    const animals = {
        morning: ['bird'],
        day: ['fish', 'seagull'],
        evening: ['butterfly'],
        night: ['cat', 'bat']
    };
    const animalType = animals[period][Math.floor(Math.random() * animals[period].length)];
    const animalCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < animalCount; i++) {
        const animal = document.createElement('div');
        animal.className = `animal ${animalType} show`;
        animal.style.left = `${Math.random() * 70 + 10}%`;
        background.appendChild(animal);
    }
}

function setRandomTime() {
    correctHour = Math.floor(Math.random() * 24);
    correctMinute = Math.floor(Math.random() * 12) * 5;
    const displayHour = correctHour % 12 || 12;
    const hourAngle = (displayHour * 30) + (correctMinute * 0.5);
    const minuteAngle = correctMinute * 6;
    hourHand.style.transform = `rotate(${hourAngle}deg)`;
    minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    timeInput.value = '';
    hourSelect.value = '';
    minuteSelect.value = '';
    updateTimeIndicator();
}

function updateTimeIndicator() {
    let period, className, sceneryType;
    if (correctHour >= 5 && correctHour < 12) {
        period = 'Pagi';
        className = 'morning';
        sceneryType = sceneryOptions.morning[Math.floor(Math.random() * sceneryOptions.morning.length)];
    } else if (correctHour >= 12 && correctHour < 17) {
        period = 'Siang';
        className = 'day';
        sceneryType = sceneryOptions.day[Math.floor(Math.random() * sceneryOptions.day.length)];
    } else if (correctHour >= 17 && correctHour < 20) {
        period = 'Sore';
        className = 'evening';
        sceneryType = sceneryOptions.evening[Math.floor(Math.random() * sceneryOptions.evening.length)];
    } else {
        period = 'Malam';
        className = 'night';
        sceneryType = sceneryOptions.night[Math.floor(Math.random() * sceneryOptions.night.length)];
    }
    timeIndicator.textContent = period;
    background.className = `background ${className}`;
    createSceneryElements(sceneryType);
}

function saveHighscore(score) {
    let highscores = [];
    const encryptedData = localStorage.getItem('highscores');
    if (encryptedData) {
        const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        highscores = JSON.parse(decrypted || '[]');
    }
    highscores.push({ score, date: new Date().toLocaleString('id-ID') });
    highscores.sort((a, b) => b.score - a.score);
    highscores = highscores.slice(0, 5);
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(highscores), ENCRYPTION_KEY).toString();
    localStorage.setItem('highscores', encrypted);
}

function downloadHighscore() {
    const encryptedData = localStorage.getItem('highscores');
    if (encryptedData) {
        const blob = new Blob([encryptedData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'highscore.json';
        a.click();
        URL.revokeObjectURL(url);
    } else {
        showPopup('Belum ada highscore untuk diunduh!', 'error');
    }
}

function displayHighscores() {
    let highscores = [];
    const encryptedData = localStorage.getItem('highscores');
    if (encryptedData) {
        const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
        highscores = JSON.parse(decrypted || '[]');
    }
    highscoreList.innerHTML = '';
    highscores.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. Skor: ${entry.score} (${entry.date})`;
        highscoreList.appendChild(li);
    });
}

function checkAnswer() {
    if (gameOverScreen.style.display === 'block') return;

    let inputHour, inputMinute;
    const displayHour = correctHour % 12 || 12;
    if (inputMode === 'text') {
        const timeRegex = /^(\d{1,2}):(\d{2})$/;
        if (!timeRegex.test(timeInput.value)) {
            showPopup('Format waktu salah! Gunakan HH:MM', 'error');
            return;
        }
        const [_, hours, minutes] = timeInput.value.match(timeRegex);
        inputHour = parseInt(hours);
        inputMinute = parseInt(minutes);
    } else {
        if (hourSelect.value === '' || minuteSelect.value === '') {
            showPopup('Pilih jam dan menit dari dropdown!', 'error');
            return;
        }
        inputHour = parseInt(hourSelect.value);
        inputMinute = parseInt(minuteSelect.value);
    }

    if ((inputHour === displayHour || inputHour === correctHour) && inputMinute === correctMinute) {
        score += 10;
        scoreElement.textContent = score;
        showPopup('Benar! Lanjut ke jam berikutnya.', 'success');
        setTimeout(() => {
            closePopup();
            setRandomTime();
        }, 1500);
    } else {
        mistakes++;
        mistakesElement.textContent = mistakes;
        mistakeHistory.push({
            userInput: `${inputHour.toString().padStart(2, '0')}:${inputMinute.toString().padStart(2, '0')}`,
            correctTime: `${displayHour.toString().padStart(2, '0')}:${correctMinute.toString().padStart(2, '0')}`
        });
        showPopup(`Gagal! Seharusnya jam ${displayHour.toString().padStart(2, '0')}:${correctMinute.toString().padStart(2, '0')}.`, 'error');
        setTimeout(() => {
            closePopup();
            setRandomTime();
        }, 1500);
        if (mistakes >= 5) {
            saveHighscore(score);
            showGameOver();
        }
    }
}

function showPopup(message, type) {
    popupMessage.textContent = message;
    popup.className = `popup ${type} show`;
}

function closePopup() {
    popup.className = 'popup';
}

function showGameOver() {
    finalScoreElement.textContent = score;
    mistakeList.innerHTML = '';
    mistakeHistory.forEach((mistake, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. Tebakan: ${mistake.userInput}, Seharusnya: ${mistake.correctTime}`;
        mistakeList.appendChild(li);
    });
    displayHighscores();
    gameOverScreen.style.display = 'block';
    gameOverScreen.className = 'game-over show';
    document.querySelector('.container').style.opacity = '0.3';
}

function restartGame() {
    score = 0;
    mistakes = 0;
    mistakeHistory = [];
    scoreElement.textContent = score;
    mistakesElement.textContent = mistakes;
    gameOverScreen.style.display = 'none';
    gameOverScreen.className = 'game-over';
    document.querySelector('.container').style.opacity = '1';
    setRandomTime();
}

function toggleInputMode() {
    if (inputMode === 'text') {
        inputMode = 'dropdown';
        timeInput.style.display = 'none';
        dropdownContainer.style.display = 'flex';
        timeInput.style.opacity = '0';
        dropdownContainer.style.opacity = '1';
        toggleInputModeButton.textContent = 'Ganti ke Ketik';
    } else {
        inputMode = 'text';
        timeInput.style.display = 'block';
        dropdownContainer.style.display = 'none';
        timeInput.style.opacity = '1';
        dropdownContainer.style.opacity = '0';
        toggleInputModeButton.textContent = 'Ganti ke Dropdown';
    }
}

timeInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 2) {
        value = value.slice(0, 2) + ':' + value.slice(2, 4);
    }
    e.target.value = value;
});

setRandomTime();