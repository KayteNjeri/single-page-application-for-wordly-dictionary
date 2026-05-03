// DOM Elements
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("word-input");

const output = document.getElementById("output");
const wordOutput = document.getElementById("word");
const wordPhonetic = document.getElementById("phonetic");
const wordDefinition = document.getElementById("definition");
const wordAudio = document.getElementById("audio");
const wordSynonym = document.getElementById("synonyms");
const wordSource = document.getElementById("sourceUrl");
const wordError = document.getElementById("error");

const saveButton = document.getElementById("saveButton");
const favoriteList = document.getElementById("favoriteWords");

// Variables
let currentWord="";
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

//Search word from provided API
async function searchWords(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

        const data = await response.json();
        //API returns null if the word when not found
        if(!Array.isArray(data)) return null;
        
        return data[0];

    } catch (error) {
        console.error("Error fetching the word:", error);
        return null;
    }
}

//Paint the DOM- display word, its meanings (definitions), examples, phonetics, audio and sourceurls
function displayWord(data) {
    //show the output container
    output.classList.remove("hidden");

    //handle any invalid words
    if(!data) { 
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

    //reset sections before rendering a new word
    wordDefinition.innerHTML = "";
    wordSynonym.innerHTML = "";
    wordAudio.innerHTML = "";
    wordSource.innerHTML = "";

    //gives the title of the word being searched
    wordOutput.textContent = data.word;

    //phonetics - gives the phonetics of the searched word
    const phonetic = data.phonetics?.find(p => p.text)?.text;
    wordPhonetic.textContent = phonetic || "No pronunciation available";

    //definitions - gives the meanings of the searched word
    wordDefinition.innerHTML = "<h3>Meanings</h3>"
        const meanings = data.meanings || [];
            meanings.forEach(meaning => {
            const block = document.createElement("div");
            block.className = "meaning-block";

            //Parts of the speech - either noun, verb or interjection
            const partOfSpeech = document.createElement("h4");
            partOfSpeech.textContent = meaning.partOfSpeech || "";
            block.append(partOfSpeech);

            //Give definitions under parts of speech and Examples
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

   //Synonyms
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
    
   //Word Audio Pronunciation
   wordAudio.innerHTML = "";
   const audioURL = data.phonetics?.find(p => p.audio)?.audio;

   if(audioURL) {
    const btn = document.createElement("button");
    btn.textContent = "🔊 Play the Pronunciation";
    
    btn.addEventListener("click", () => {
        new Audio(audioURL).play();
        });

    wordAudio.append(btn);
    }

    //Source urls for the words
    const sourceURL = data.sourceUrls;

    if(sourceURL && sourceURL.length > 0) {
        const links = sourceURL
        .map(sourceURL => `<a href="${sourceURL}" target="_blank">${sourceURL}</a>`)
        .join("<br>");

        wordSource.innerHTML = `
            <h3>SourceUrls</h3>
            ${links}
        `;
    }
    output.classList.remove("hidden");
}

// Save favorite words
function renderFavoriteWords(){
    favoriteList.innerHTML = "";
    //when favorite words have not been saved
    if (favorites.length === 0) {
        favoriteList.innerHTML = "<li>No favorite words yet!</li>";
        return;
    }
    //when there are saved favorite words, to appear in list format
    favorites.forEach(word => {
        const term = document.createElement("li");
        term.className = "favorite-item";
        
        term.innerHTML = `
        <span>${word}</span>
        <button class="remove-fav-button">✕</button>`;

        //click word to search it again from the dictionary
        term.querySelector("span").onclick = () => 
            searchAndGiveOutput(word);

        // how to remove the favorite words
        term.querySelector("button").onclick = () => {
            favorites = favorites.filter(w => w !== word);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            renderFavoriteWords();
        };
        favoriteList.append(term);
    });
}

//Search and display the API data 
async function searchAndGiveOutput(word) {
    const data = await searchWords(word);
    console.log("API DATA:", data);
    displayWord(data);
}

// Submit the form
searchForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    const word = searchInput.value.trim();
    if(!word) return;

    await searchAndGiveOutput(word);
    
    searchInput.value = "";
});

//Add event listener to save a seached word under my favorite words
saveButton.addEventListener("click", () => {
    if (!currentWord) return;

    if (!favorites.includes(currentWord)) {
        favorites.push(currentWord);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderFavoriteWords();
    }
});

// Initial
renderFavoriteWords();