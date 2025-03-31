
const splashScreen = document.querySelector('#splash-screen');
const theGame = document.querySelector('#the-game');
const h3TheGame = document.querySelector('.h3thegame');


let countElement = document.getElementById("count");
let timeToEnd;   
let timeToStart = 15; 
let startTimerInterval = null;
let endTimerInterval = null;


let matchedPhotos = [];
let cont = 2;     
let level = 1;   
let searchWords = [
    "cute", "adorable", "fluffy", "sweet", "baby animals", 
    "kawaii", "puppies", "kittens", "cozy", "whimsical", 
    "pastel", "soft aesthetic", "cartoon", "chibi", "tiny things", 
    "dreamy", "fantasy", "fairy tale", "magical", "happy", 
    "smiling", "playful", "funny animals", "heartwarming"
];

let firstCard = null;
let secondCard = null;


function startCountdownToStartGame() {
    clearInterval(startTimerInterval);
    timeToStart = 15; 
    countElement.textContent = timeToStart;
    
    startTimerInterval = setInterval(() => {
        countElement.textContent = timeToStart;
        timeToStart--;
        if (timeToStart < 0) {
            clearInterval(startTimerInterval);
            hideCards();            
            startCountdownToEndGame(); 
        }
    }, 1000);
}

function startCountdownToEndGame() {
    clearInterval(endTimerInterval);
    timeToEnd = 15 + level * 2;
    countElement.textContent = timeToEnd;
    
    endTimerInterval = setInterval(() => {
        countElement.textContent = timeToEnd;
        timeToEnd--;
        
 
        if (matchedPhotos.length === 0) {
            clearInterval(endTimerInterval);
            h3TheGame.innerHTML = "🎉 You win! أنهيت جميع الصور قبل انتهاء الوقت.";
          
            setTimeout(showContinuePrompt, 1000);
            return;
        }
        
    
        if (timeToEnd < 0) {
            clearInterval(endTimerInterval);
            if (matchedPhotos.length > 0) {
                h3TheGame.innerHTML = "❌ You lost! انتهى الوقت ولم تنتهِ من مطابقة الصور.";
               
                setTimeout(showRetryPrompt , 1000);
            }
        }
    }, 1000);
}


function fetchPhotos() {
    matchedPhotos = []; 
    let randomWord = searchWords[Math.floor(Math.random() * searchWords.length)];
    fetch(`https://api.pexels.com/v1/search?query=${randomWord}&per_page=${cont}`, {
        headers: {
            Authorization: "qHWGyjK9LtRvKTX6m2vOOrbI66MaXa2v9qcEXwzqRa16kB0ybM6RidLQ"
        }
    })
    .then(response => response.json())
    .then(data => { 
        data.photos.forEach(photo => {
           
            matchedPhotos.push(photo);
            matchedPhotos.push(photo);
        });
        shuffleArray(matchedPhotos);
        displayImages();
    });
}

function displayImages(){
    const imgsContainer = document.querySelector('#imges');
    imgsContainer.innerHTML = '';

    matchedPhotos.forEach(photo => {
        let container = document.createElement('div');
      
        container.classList.add('revealed');  
        
        let img = document.createElement('img');
        img.src = photo.src.medium;
        img.alt = photo.photographer;
        img.id = photo.id;

        container.appendChild(img);
        imgsContainer.appendChild(container);
    });
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}


function hideCards() {
    document.querySelectorAll(".revealed").forEach(card => {
        card.classList.remove("revealed");
        card.classList.add("image-container");
    });
}


document.addEventListener('click', (e) => {
    let clickedContainer = e.target.closest(".image-container");
    if (!clickedContainer) return;
    
 
    clickedContainer.classList.add("revealed");
    let clickedCard = clickedContainer.querySelector("img");
    
    if (clickedCard.tagName === "IMG") {
        if (firstCard === null) {
            firstCard = clickedCard;
        } else if (firstCard === clickedCard) {
            h3TheGame.innerHTML = "⚠️ لا يمكنك اختيار نفس الصورة مرتين!";
            return;
        } else {
            secondCard = clickedCard;
            if (firstCard.src === secondCard.src) {
                h3TheGame.innerHTML = "✅ تطابق!";
               
                matchedPhotos = matchedPhotos.filter(item => item.id !== Number(firstCard.id));
                setTimeout(() => {
                    firstCard.parentElement.remove();
                    secondCard.parentElement.remove();
                    firstCard = null;
                    secondCard = null;
                  
                    if (matchedPhotos.length === 0) {
                        clearInterval(endTimerInterval);
                        setTimeout(showContinuePrompt, 1000);
                    }
                }, 1000);
            } else {
                h3TheGame.innerHTML = "❌ غير متطابق!";
                setTimeout(() => {
                    firstCard.closest(".image-container").classList.remove("revealed");
                    secondCard.closest(".image-container").classList.remove("revealed");
                    firstCard = null;
                    secondCard = null;
                }, 1000);
            }
        }
    }
});


function showContinuePrompt() {
    let continueButton = document.querySelector("#btnN");
    continueButton.style.display='block';
    continueButton.addEventListener("click", () => {
        continueButton.style.display='none';
        nextLevel();
    });

}



function showRetryPrompt() {
    let retryButton = document.querySelector('button')
    retryButton.style.display='block';
    retryButton.textContent = "إعادة المحاولة";
    
    retryButton.addEventListener("click", () => {
        retryButton.style.display='none';
        resetGameToCurrentLevel();
    });

    theGame.appendChild(retryButton);
}


function nextLevel() {
    level++;
    cont += 1; 
    h3TheGame.innerHTML = `المستوى ${level}`;
    fetchPhotos();
    
    setTimeout(startCountdownToStartGame, 2000);
}


function resetGameToCurrentLevel() {
    h3TheGame.innerHTML = `المستوى ${level} - حاول مرة أخرى`;
    fetchPhotos();
    setTimeout(startCountdownToStartGame, 2000);
}


window.addEventListener("load", () => {
   setTimeout((e)=>{
    splashScreen.style.display='none'
   },1500)
});

fetchPhotos();
startCountdownToStartGame();
