// Elements
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("word-input");
//create elements for output
const output = document.getElementById("output");
const wordOutput = document.getElementById("word");
const wordPhonetic = document.getElementById("phonetic");
const wordDefinition = document.getElementById("definition");
const wordAudio = document.getElementById("audio");
const wordSynonym = document.getElementById("synonyms");
const wordSource = document.getElementById("sourceUrl");
const wordError = document.getElementById("error");

const saveButton = document.getElementById("saveButton");
//create element for favorites
const favoriteList = document.getElementById("favoriteWords");

let currentWord="";
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

//Access API data
async function searchWords(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

        //if (!response.ok) throw new Error("Word not found");
        const data = await response.json();
        console.log("API:", data);

        if(!Array.isArray(data)) return null;
        
        return data[0];

    } catch (error) {
        console.error("Error fetching the word:", error);
        return null;
    }
}

//display data/word and its meanings, examples, audio and sourceurl
function displayWord(data) {
    output.classList.remove("hidden");
    if(!data) { 
    //output.innerHTML = "<p>The word has not been found.</p>";
        wordError.textContent = "The word has not been found. Try another word.";
        output.classList.add("hidden");

        wordOutput.textContent = "";
        wordPhonetic.textContent = "";
        wordDefinition.innerHTML = "";
        wordSynonym.innerHTML = "";
        wordAudio.innerHTML = "";
        wordSource.innerHTML = "";
        return;
   }

   wordError.textContent = "";

   currentWord = data.word;  

    wordDefinition.innerHTML = "";
    wordSynonym.innerHTML = "";
    wordAudio.innerHTML = "";
    wordSource.innerHTML = "";

   wordOutput.textContent = data.word;
   //phonetic
   wordPhonetic.textContent = data.phonetic || "No pronunciation available";
   //definition
   wordDefinition.innerHTML = "<h3>Meanings</h3>"

        const meanings = data.meanings || [];
        meanings.forEach(meaning => {
            const block = document.createElement("div");
            block.className = "meaning-block";

            const partOfSpeech = document.createElement("h4");
            partOfSpeech.textContent = meaning.partOfSpeech || "";
            block.append(partOfSpeech);

        const definitions = meaning.definitions || [];

            definitions.forEach(def => {
            const defItem = document.createElement("p");
            defItem.innerHTML = `
                <strong>Definition:</strong> ${def.definition || ""}
                ${def.example ? `<br><em>Example: ${def.example}</em>` : ""}
            `;
         block.append(defItem);
      });
      wordDefinition.append(block);
    });

   //synonym
   wordSynonym.innerHTML ="<h3>Synonyms</h3>";
   const synonyms = data.meanings
    .flatMap(m => m.definitions || [])
    .flatMap(d => d.synonyms || []);

    if (synonyms.length > 0) {
        synonyms.forEach(s => {
            const span = document.createElement("span");
            span.textContent = s;
            span.className = "synonym";
            wordSynonym.append(span);
        });
    } else {
        wordSynonym.innerHTML += "<p>Synonyms not available</p>";
    }
    
   //audio
   wordAudio.innerHTML = "";
   const audioURL = data.phonetics?.find(p => p.audio)?.audio;

   if(audioURL) {
    const btn = document.createElement("button");
    btn.textContent = "🔊Play the Pronunciation";
    
    btn.addEventListener("click", () => {
        new Audio(audioURL).play();
        });

    wordAudio.append(btn);
    }

    //source urls
    const sourceURL = data.sourceUrls?.[0];

    if(sourceURL) {
        wordSource.innerHTML = `
            <h3>SourceUrl</h3>
            <a href="${sourceURL}" target="_blank">${sourceURL}</a>
        `;
    }
    output.classList.remove("hidden");
}

//save favorite words
function renderFavoriteWords(){
    favoriteList.innerHTML = "";

    if (favorites.length === 0) {
        favoriteList.innerHTML = "<li>No favorite words yet!</li>";
        return;
    }
    favorites.forEach(word => {
        const term = document.createElement("li");
        term.className = "favorite-item";
        
        term.innerHTML = `
        <span>${word}</span>
        <button class="remove-fav-button">✕</button>`;

        term.querySelector("span").onclick = () => searchAndGiveOutput(word);

        term.querySelector("button").onclick = () => {
            favorites = favorites.filter(w => w !== word);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            renderFavoriteWords();
        };
        favoriteList.append(term);
    });
}

async function searchAndGiveOutput(word) {
    const data = await searchWords(word);
    console.log("API DATA:", data);
    displayWord(data);
}

//submit the form
searchForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    const word = searchInput.value.trim();
    if(!word) return;

    await searchAndGiveOutput(word);
    
    searchInput.value = "";
});

//add event listener to save favorites
saveButton.addEventListener("click", () => {
    if (!currentWord) return;

    if (!favorites.includes(currentWord)) {
        favorites.push(currentWord);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderFavoriteWords();
    }
});

renderFavoriteWords();