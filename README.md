# A Single Page Application for Wordly Dictionary

A Single Page Application is a responsive, front-end web application designed to allow users to search for words, show the word's definitions, it's pronunciation, synonyms and source details. It is built using web technologies and integrates with [Free Dictionary API](https://dictionaryapi.dev/).

## Features

- **Word Search:** Search for English words by inputting a word.
- **Meanings:** Shows the word's definitions, it's pronunciation, how it is used (examples in sentences), it's synonyms (related words), provides an audio playback for pronunciation when available and also gives the sourceUrl for the definitions.
- **Favorite Words** Save favorite words for any future reference. The favorite words will be stored locally in the browser.
- **Responsive Design** Built with modern CSS techniques including Grid and Flexbox, featuring a clean layout for a responsive and user-friendly interface.

## Technologies Used

- **HTML5:** Semantic structure.
- **CSS:** Modern styling - Flexbox, CSS Grid
- **JavaScript:** Fetch data from the [Free Dictionary API](https://dictionaryapi.dev/) by the use of asynchronous JavaScript (`async` and `await`)
 - Displaying fetched data
 - Handling user input and events

## Getting Started

Running the project is straightforward since this is a frontend project without build tools.

## Prerequisites

You need a browser (Chrome, Mozilla, Edge) to run this application.

## Installation

1. Clone the repository:

   ```bash
git clone https://github.com/KayteNjeri/single-page-application-for-wordly-dictionary
   ```

2. Navigate to the project directory in the terminal:

   ```bash
   cd single-page-application-for-wordly-dictionary
   ```

3. Simply open the `index.html` file by in your browser. Consider having an extension of **Live Server** in VS Code in order to run the project over a local HTTP server.

## Project Structure

- `index.html`: This is the main HTML structure, which includes search form with input and submit button, a section to display the results, and favorite words sidebar.  
- `main.js`: This is the core application logic handling the API calls, event listeners, and DOM manipulation.
- `style.css`: This is used for styling the website using CSS properties.

## API Reference

This application uses the free Dictionary API.
- **Get word definitions:** `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`

## Future Improvements

- [ ] Save favorite words in a local storage

## Licence

This project is licenced under the ...........

