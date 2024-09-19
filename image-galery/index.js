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

    fetchPictures(value);
});

searchButton.addEventListener('click', async () => {
    const value = input.value;
    if (!value) return;

    fetchPictures(value);
});

async function fetchPictures(query) {
    const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=9ACCQ9DMUfPamOT661GxHbzG1zEAj4yFmEQvoW2tdDw`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(data);
    return data;
}

function renderCards(data) {

}

(async () => {
    const pictures = await fetchPictures('default');
    renderCards(pictures);
})();
