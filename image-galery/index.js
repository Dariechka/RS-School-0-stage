const input = document.querySelector('input');
const searchButton = document.querySelector('.search__input_button_find');
const clearButton = document.querySelector('.search__input_button_clear');

clearButton.style.display = 'none';
clearButton.addEventListener('click', () => {
    input.value = '';
    clearButton.style.display = 'none';
});

input.addEventListener('keypress', async (event) => {
    clearButton.style.display = 'block';
    
    const value = input.value;
    if (event.code !== 'Enter' || !value) return;

    renderCards(value);
});

searchButton.addEventListener('click', async () => {
    const value = input.value;
    if (!value) return;

    renderCards(value);
});

async function fetchPictures(query, size) {
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=${size}&client_id=9ACCQ9DMUfPamOT661GxHbzG1zEAj4yFmEQvoW2tdDw`;
    
    const response = await fetch(url);
    const json = await response.json();

    return json.results;
}

async function renderCards(query) {
    const cards = queryCards();
    const pictures = await fetchPictures(query, cards.length);

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const picture = pictures[i];
        
        card.querySelector('.results__img_img_picture').src = `${picture.urls.regular}`;
        card.querySelector('.results__img_author_text').innerHTML = `${picture.user.name}`;
    }
}

function queryCards() {
    const containers = Array.from(document.querySelectorAll('.results__container'));
    return containers.flatMap(container => Array.from(container.children));
}

// (async () => {
//     renderCards('value');
// })();
