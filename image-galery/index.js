const input = document.querySelector('input');
const searchButton = document.querySelector('.search__input_button_find');
const clearButton = document.querySelector('.search__input_button_clear');
clearButton.style.display = 'none';
clearButton.addEventListener('click', function clear(){
    input.value = '';
});



input.addEventListener("keypress", async function getDate (event) {
    clearButton.style.display = 'block';

    if (event.code !== 'Enter') return;

    const url = `https://api.unsplash.com/search/photos?query=${input.value}&client_id=9ACCQ9DMUfPamOT661GxHbzG1zEAj4yFmEQvoW2tdDw`;

    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
}
);

searchButton.addEventListener('click', async function getDateOnClick (){
    clearButton.style.display = 'block';
    const url = `https://api.unsplash.com/search/photos?query=${input.value}&client_id=9ACCQ9DMUfPamOT661GxHbzG1zEAj4yFmEQvoW2tdDw`;

    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
});


  
