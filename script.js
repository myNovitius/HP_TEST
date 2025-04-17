const inventoryPanel = document.getElementById('inventory-panel');
const inventoryList = document.getElementById('inventory-list');
const moneyStatus = document.getElementById('money-status');

const characterCreationScreen = document.getElementById('character-creation');
const characterNameInput = document.getElementById('character-name');
const abilityDistribution = document.getElementById('ability-distribution');

const intelligenceInput = document.getElementById('intelligence');
const intelligenceValueSpan = document.querySelector('#intelligence + .ability-value');
const courageInput = document.getElementById('courage');
const courageValueSpan = document.querySelector('#courage + .ability-value');
const loyaltyInput = document.getElementById('loyalty');
const loyaltyValueSpan = document.querySelector('#loyalty + .ability-value');
const ambitionInput = document.getElementById('ambition');
const ambitionValueSpan = document.querySelector('#ambition + .ability-value');

const remainingPointsSpan = document.getElementById('remaining-points');
const backgroundRadios = document.querySelectorAll('input[name="background"]');
const createCharacterButton = document.getElementById('create-character-button');

const sortingHatScreen = document.getElementById('sorting-hat');
const sortingHatQuestionDiv = document.getElementById('sorting-hat-question');
const sortingHatAnswersDiv = document.getElementById('sorting-hat-answers');
const sortingHatResultDiv = document.getElementById('sorting-hat-result');

const diagonAlleyScreen = document.getElementById('diagon-alley');
const shopsDiv = document.getElementById('shops');
const finishShoppingButton = document.getElementById('finish-shopping-button');

const gamePlayScreen = document.getElementById('game-play');
const messageAreaDiv = document.getElementById('message-area');
const inputAreaDiv = document.getElementById('input-area');
const commandInput = document.getElementById('command');
const sendButton = document.getElementById('send-button');

let remainingPoints = 30;
const abilities = {
    intelligence: { input: intelligenceInput, span: intelligenceValueSpan, value: 1 },
    courage: { input: courageInput, span: courageValueSpan, value: 1 },
    loyalty: { input: loyaltyInput, span: loyaltyValueSpan, value: 1 },
    ambition: { input: ambitionInput, span: ambitionValueSpan, value: 1 }
};

let character = null;
const currencyConversion = {
    galleon: 493,
    sickle: 29,
    knut: 1
};
let characterMoneyKnut = 0;
let characterInventory = {};

function convertToKnut(money) {
    return (money.galleon * currencyConversion.galleon) + (money.sickle * currencyConversion.sickle) + money.knut;
}

function formatMoney(totalKnut) {
    const galleon = Math.floor(totalKnut / currencyConversion.galleon);
    totalKnut %= currencyConversion.galleon;
    const sickle = Math.floor(totalKnut / currencyConversion.sickle);
    const knut = totalKnut % currencyConversion.sickle;
    return { galleon: galleon, sickle: sickle, knut: knut };
}

function updateRemainingPoints() {
    remainingPointsSpan.textContent = `Kalan Puan: ${remainingPoints}`;
}

function updateAbilityValue(abilityName) {
    const ability = abilities[abilityName];
    ability.span.textContent = ability.input.value;
    ability.value = parseInt(ability.input.value);
}

for (const abilityName in abilities) {
    const ability = abilities[abilityName];
    ability.input.addEventListener('input', () => {
        const newValue = parseInt(ability.input.value);
        const difference = newValue - ability.value;

        if (remainingPoints >= difference && newValue >= 1 && newValue <= 10) {
            remainingPoints -= difference;
            ability.value = newValue;
            ability.span.textContent = newValue;
            updateRemainingPoints();
        } else {
            ability.input.value = ability.value;
        }
    });
}

function updateMoneyDisplay() {
    const moneyFormat = formatMoney(characterMoneyKnut);
    moneyStatus.textContent = `Paranız: ${moneyFormat.galleon} Galleon, ${moneyFormat.sickle} Sickle, ${moneyFormat.knut} Knut`;
}

function updateInventoryDisplay() {
    inventoryList.innerHTML = '';
    for (const item in characterInventory) {
        const listItem = document.createElement('li');
        listItem.textContent = `${item} (${characterInventory[item]})`;
        inventoryList.appendChild(listItem);
    }
}
const sortingHatQuestions = [
    {
        question: "En çok hangi özelliği takdir edersin?",
        answers: { Cesaret: "Gryffindor", Çalışkanlık: "Hufflepuff", Zeka: "Ravenclaw", Hırs: "Slytherin" }
    },
    {
        question: "Hangi tür zorluklarla yüzleşmekten hoşlanırsın?",
        answers: { "Tehlikeli maceralar": "Gryffindor", "Karmaşık problemleri çözmek": "Ravenclaw", "Başkalarına yardım etmek": "Hufflepuff", "Güç kazanmak": "Slytherin" }
    },
    {
        question: "Bir anlaşmazlığı çözerken nasıl bir yaklaşım sergilersin?",
        answers: { "Doğrudan ve dürüstçe": "Gryffindor", "Dikkatlice ve mantıklı bir şekilde": "Ravenclaw", "Empati kurarak ve uzlaşmacı bir şekilde": "Hufflepuff", "Kendi çıkarlarını gözeterek": "Slytherin" }
    },
    {
        question: "En çok hangi ortamda rahat hissedersin?",
        answers: { "Kalabalık ve hareketli bir ortamda": "Gryffindor", "Sakin ve düşünceli bir ortamda": "Ravenclaw", "Samimi ve destekleyici bir ortamda": "Hufflepuff", "Gizemli ve stratejik bir ortamda": "Slytherin" }
    },
    {
        question: "Başarısız olduğunda ne yaparsın?",
        answers: { "Tekrar denerim, yılmam": "Gryffindor", "Nerede hata yaptığımı analiz ederim": "Ravenclaw", "Arkadaşlarımın desteğini ararım": "Hufflepuff", "Bir sonraki hamlemi planlarım": "Slytherin" }
    }
];
let currentQuestionIndex = 0;
let housePoints = { Gryffindor: 0, Hufflepuff: 0, Ravenclaw: 0, Slytherin: 0 };
let selectedHouse = null;

function startSortingHat() {
    characterCreationScreen.style.display = 'none';
    sortingHatScreen.style.display = 'block';
    showNextQuestion();
}

function showNextQuestion() {
    if (currentQuestionIndex < sortingHatQuestions.length) {
        const currentQuestion = sortingHatQuestions[currentQuestionIndex];
        sortingHatQuestionDiv.textContent = currentQuestion.question;
        sortingHatAnswersDiv.innerHTML = '';

        for (const answer in currentQuestion.answers) {
            const answerButton = document.createElement('button');
            answerButton.textContent = answer;
            answerButton.addEventListener('click', () => {
                const house = currentQuestion.answers[answer];
                housePoints[house]++;
                currentQuestionIndex++;
                showNextQuestion();
            });
            sortingHatAnswersDiv.appendChild(answerButton);
        }
    } else {
        showSortingHatResult();
    }
}

function showSortingHatResult() {
    let highestScore = -1;
    for (const house in housePoints) {
        if (housePoints[house] > highestScore) {
            highestScore = housePoints[house];
            selectedHouse = house;
        } else if (housePoints[house] === highestScore && selectedHouse !== null && Math.random() < 0.5) {
            selectedHouse = house;
        } else if (selectedHouse === null) {
            selectedHouse = house;
        }
    }

    sortingHatQuestionDiv.textContent = "Seçmen Şapka düşünüyor...";
    sortingHatAnswersDiv.innerHTML = '';
    sortingHatResultDiv.textContent = `Hmm... Senin için en uygun binanın ${selectedHouse.toUpperCase()} olduğuna karar verdim!`;
    character = { ...character, house: selectedHouse }; // Bina bilgisini karaktere ekle

    setTimeout(startDiagonAlley, 2000);
}
const shopsData = [
    {
        name: "Ollivander'ın Asa Dükkanı",
        items: [
            { name: "Asa", price: { galleon: 7, sickle: 0, knut: 0 }, description: "Her büyücünün ihtiyacı olan temel araç." }
        ]
    },
    {
        name: "Madam Malkin'in Her Türlü Cübbesi",
        items: [
            { name: "Hogwarts Cübbesi", price: { galleon: 5, sickle: 15, knut: 0 }, description: "Okulunuzun gururunu taşıyın." },
            { name: "Günlük Cübbe", price: { galleon: 3, sickle: 0, knut: 0 }, description: "Günlük kullanım için rahat cübbe." }
        ]
    },
    {
        name: "Baykuş Emporium",
        items: [
            { name: "Kar Baykuşu", price: { galleon: 12, sickle: 0, knut: 0 }, description: "Asil ve sadık bir dost." },
            { name: "Ahır Baykuşu", price: { galleon: 7, sickle: 0, knut: 0 }, description: "Güvenilir bir haberci." }
        ]
    },
    {
        name: "Flourish ve Blotts",
        items: [
            { name: "Standart Büyü Kitabı (1. Sınıf)", price: { galleon: 2, sickle: 0, knut: 0 }, description: "İlk yılınız için temel büyü kitabı." },
            { name: "Büyü Tarihi", price: { galleon: 3, sickle: 5, knut: 0 }, description: "Büyücülük tarihine dair kapsamlı bir eser." }
        ]
    }
];

function startDiagonAlley() {
    sortingHatScreen.style.display = 'none';
    diagonAlleyScreen.style.display = 'block';
    displayShops();
    determineCharacterMoney();
    updateMoneyDisplay();
    updateInventoryDisplay();
}

function determineCharacterMoney() {
    switch (character.background) {
        case 1: // Fakir
            characterMoneyKnut = convertToKnut({ galleon: 1, sickle: 5, knut: 0 });
            break;
        case 2: // Orta Halli
            characterMoneyKnut = convertToKnut({ galleon: 5, sickle: 10, knut: 0 });
            break;
        case 3: // Varlıklı
            characterMoneyKnut = convertToKnut({ galleon: 10, sickle: 0, knut: 0 });
            break;
        default:
            characterMoneyKnut = 0;
            break;
    }
    updateMoneyDisplay();
}

function displayShops() {
    shopsDiv.innerHTML = '';
    shopsData.forEach(shop => {
        const shopDiv = document.createElement('div');
        shopDiv.classList.add('shop');
        const shopTitle = document.createElement('h3');
        shopTitle.textContent = shop.name;
        shopDiv.appendChild(shopTitle);

        shop.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');
            const formattedPrice = formatMoney(convertToKnut(item.price));
            itemDiv.textContent = `${item.name} - Fiyat: ${formattedPrice.galleon} Galleon, ${formattedPrice.sickle} Sickle, ${formattedPrice.knut} Knut - Açıklama: ${item.description}`;
            const buyButton = document.createElement('button');
            buyButton.textContent = 'Satın Al';
            buyButton.addEventListener('click', () => buyItem(item));
            itemDiv.appendChild(buyButton);
            shopDiv.appendChild(itemDiv);
        });

        shopsDiv.appendChild(shopDiv);
    });
    finishShoppingButton.style.display = 'block';
}

function buyItem(item) {
    const itemPriceKnut = convertToKnut(item.price);
    if (characterMoneyKnut >= itemPriceKnut) {
        characterMoneyKnut -= itemPriceKnut;
        updateMoneyDisplay();
        if (characterInventory[item.name]) {
            characterInventory[item.name]++;
        } else {
            characterInventory[item.name] = 1;
        }
        updateInventoryDisplay();
        console.log(`${item.name} satın alındı. Envanter:`, characterInventory);
        alert(`${item.name} başarıyla satın alındı.`);
    } else {
        alert("Yeterli paranız yok!");
    }
}

finishShoppingButton.addEventListener('click', () => {
    diagonAlleyScreen.style.display = 'none';
    gamePlayScreen.style.display = 'block';
    messageAreaDiv.textContent = "Diagon Yolu'ndaki alışverişinizi tamamladınız. Şimdi Hogwarts yolculuğu zamanı!";
    inputAreaDiv.style.display = 'block';
}
createCharacterButton.addEventListener('click', () => {
    const characterName = characterNameInput.value;
    const selectedBackground = document.querySelector('input[name="background"]:checked');

    if (characterName && selectedBackground) {
        character = {
            name: characterName,
            intelligence: abilities.intelligence.value,
            courage: abilities.courage.value,
            loyalty: abilities.loyalty.value,
            ambition: abilities.ambition.value,
            background: parseInt(selectedBackground.value),
            house: null
        };
        console.log("Karakter Oluşturuldu:", character);
        startSortingHat();
    } else {
        let errorMessage = "";
        if (!characterName) errorMessage += "Lütfen bir karakter adı girin.\n";
        if (!selectedBackground) errorMessage += "Lütfen bir geçmiş seçin.\n";
        alert(errorMessage);
    }
});

// Oyun başladığında (sayfa yüklendiğinde) kalıcı envanteri ve para durumunu boş olarak göster
updateInventoryDisplay();
updateMoneyDisplay();
updateRemainingPoints();
