const input = document.querySelector('input');
const searchButton = document.querySelector('.search__input_button_find');
const clearButton = document.querySelector('.search__input_button_clear');
const imgs = Array.from(document.querySelectorAll('.results__img_img_picture'));

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
    
    document.querySelectorAll('.results__container').forEach(container => container.style.display = 'grid');
    cards.forEach(card => card.style.display = 'grid');
    document.querySelector('.results').style.height = '100%';
    document.querySelector('.erorr-text').style.display = 'none';

    if (!pictures || !pictures.length) {
        document.querySelector('.erorr-text').style.display = 'block';
        document.querySelectorAll('.results__container').forEach(container => container.style.display = 'none');
        document.querySelector('.results').style.height = '65vh';
        return;
    }

    for (let i = 0; i < pictures.length; i++) {
        const card = cards[i];
        const picture = pictures[i];
            
        card.querySelector('.results__img_img_picture').src = picture.urls.regular;
        card.querySelector('.results__img_img_picture').alt = picture.description ? picture.description : query;
        card.querySelector('.results__img_author_text').innerHTML = picture.user.name;
    }

    const renderNumber = pictures.length;
    if (renderNumber < 14) {
        document.querySelector('.results').style.height = '65vh';
    }
    const cardsForRemove = cards.slice(renderNumber);
    for (const card of cardsForRemove){
        card.style.display = 'none';
    }
}

function queryCards() {
    const containers = Array.from(document.querySelectorAll('.results__container'));
    return containers.flatMap(container => Array.from(container.children));
}

imgs.forEach((img, index) => img.addEventListener('click', () => {
    openModal(img.src, img.alt, index);
}));

function openModal(src, description, index) {
    const body = document.body;
    const background = document.querySelector('.background');
    body.classList.add('no-scroll');
    background.style.display = 'block';
    

    body.insertAdjacentHTML(
        `afterbegin`,
    `<div class="modal">
        <div class="modal__img">
            <img src="${src}" alt="${description}" class="img img_modal">
        </div>
        <div class="modal__description">${description}</div>
    </div>
    <svg fill="#000000" height="80px" width="80px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="button button__left">
        <g>
	        <g>
		        <path d="M466.811,210.812H154.283l114.691-114.69c17.618-17.619,17.618-46.288,0-63.907c-8.536-8.536-19.883-13.235-31.954-13.235
			    c-12.07,0-23.418,4.701-31.953,13.235L13.236,224.047C4.7,232.583,0,243.931,0,256.001s4.7,23.417,13.236,31.953l191.832,191.832
			    c8.535,8.536,19.883,13.236,31.953,13.236c12.071,0,23.419-4.7,31.954-13.234c17.618-17.619,17.618-46.288,0-63.907
			    l-114.691-114.69h312.528c24.918,0,45.189-20.271,45.189-45.189S491.729,210.812,466.811,210.812z M466.811,280.791H129.66
			    c-4.126,0-7.844,2.485-9.423,6.296c-1.579,3.811-0.706,8.198,2.211,11.115L254.55,430.303c9.667,9.666,9.667,25.393,0,35.059
			    c-4.682,4.682-10.907,7.261-17.529,7.261c-6.621,0-12.847-2.578-17.529-7.261L27.659,273.53
			    c-4.682-4.682-7.261-10.908-7.261-17.529s2.578-12.847,7.261-17.529L219.491,46.639c4.682-4.682,10.908-7.261,17.529-7.261
			    c6.622,0,12.847,2.578,17.529,7.261c9.667,9.666,9.667,25.393,0,35.059L122.449,213.799c-2.917,2.917-3.79,7.305-2.211,11.115
			    c1.579,3.81,5.299,6.296,9.423,6.296h337.151c13.67,0,24.79,11.121,24.79,24.79C491.602,269.67,480.481,280.791,466.811,280.791z"/>
	        </g>
        </g>
        <g>
	        <g>
		        <path d="M152.042,140.166c-3.984-3.983-10.442-3.983-14.425,0l-3.06,3.06c-3.983,3.984-3.983,10.442,0,14.425
			    c1.991,1.992,4.602,2.987,7.212,2.987s5.221-0.995,7.213-2.987l3.06-3.06C156.024,150.607,156.024,144.149,152.042,140.166z"/>
	        </g>
        </g>
        <g>
	        <g>
		        <path d="M126.034,166.174c-3.984-3.983-10.442-3.983-14.425,0l-80.574,80.574c-3.983,3.984-3.983,10.442,0,14.425
			    c1.991,1.992,4.602,2.987,7.212,2.987s5.221-0.995,7.213-2.987l80.574-80.574C130.016,176.615,130.017,170.157,126.034,166.174z"/>
	        </g>
        </g>
    </svg>
    <svg fill="#000000" height="80px" width="80px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="button button__right">
        <g>
	        <g>
		        <path d="M498.766,224.046L306.933,32.215c-8.535-8.536-19.882-13.235-31.953-13.235c-12.07,0-23.418,4.701-31.953,13.235
			    c-17.618,17.619-17.618,46.288,0,63.907l114.69,114.69H45.189C20.271,210.812,0,231.083,0,256.001s20.271,45.189,45.189,45.188
			    h312.527l-114.69,114.69c-17.618,17.619-17.618,46.288,0,63.907c8.535,8.536,19.883,13.236,31.953,13.236
			    c12.071,0,23.418-4.7,31.954-13.234l191.832-191.833C507.3,279.418,512,268.07,512,256.001
			    C512,243.931,507.3,232.583,498.766,224.046z M484.342,273.529L292.509,465.362c-4.682,4.682-10.907,7.261-17.529,7.261
			    c-6.622,0-12.847-2.578-17.529-7.261c-9.667-9.666-9.667-25.393,0-35.059l132.101-132.101c2.916-2.917,3.789-7.304,2.21-11.115
			    c-1.578-3.81-5.296-6.296-9.422-6.296H45.189c-13.67,0-24.79-11.121-24.79-24.79c0-13.669,11.12-24.79,24.79-24.79h337.15
			    c4.126,0,7.844-2.485,9.422-6.296c1.579-3.811,0.706-8.198-2.21-11.115L257.449,81.698c-9.667-9.666-9.667-25.393,0-35.059
			    c4.682-4.682,10.907-7.261,17.529-7.261c6.622,0,12.847,2.578,17.529,7.261l191.833,191.832
			    c4.682,4.682,7.261,10.908,7.261,17.529C491.602,262.622,489.023,268.847,484.342,273.529z"/>
	        </g>
        </g>
        <g>
	        <g>
		        <path d="M377.444,143.226l-3.06-3.06c-3.985-3.983-10.441-3.983-14.425,0c-3.983,3.984-3.983,10.442,0,14.425l3.06,3.06
			    c1.992,1.992,4.601,2.987,7.212,2.987c2.611,0,5.22-0.995,7.213-2.987C381.427,153.667,381.427,147.209,377.444,143.226z"/>
	        </g>
        </g>
        <g>
	        <g>
		        <path d="M480.966,246.748l-80.574-80.574c-3.985-3.983-10.441-3.983-14.425,0c-3.983,3.984-3.983,10.442,0,14.425l80.574,80.574
			    c1.992,1.992,4.601,2.987,7.212,2.987c2.611,0,5.22-0.995,7.213-2.987C484.949,257.189,484.949,250.731,480.966,246.748z"/>
	        </g>
        </g>
    </svg>`
    );

    const modal = document.querySelector('.modal');
    const buttonsArrow = Array.from(document.querySelectorAll('.button'));
    background.addEventListener('click', function closeModalListener(event) {
        if (modal.contains(event.target)) {
             return;
        }
        
        modal.remove();
        buttonsArrow.forEach(buttonArrow => buttonArrow.remove());
        body.classList.remove('no-scroll');
        background.style.display = 'none';

        body.removeEventListener('click', closeModalListener);
    });

    const previous = buttonsArrow[0];
    const next = buttonsArrow[1];

    next.addEventListener('click', () => {
        previous.style.display = 'block';
        document.querySelector('.img_modal').src = imgs[index + 1].src;
        document.querySelector('.img_modal').alt = imgs[index + 1].alt;
        document.querySelector('.modal__description').innerHTML = imgs[index + 1].alt;

        index = index + 1;

        if (index === 13){
            next.style.display = 'none';
        }  
    });
    previous.addEventListener('click', () => {
        next.style.display = 'block';
        document.querySelector('.img_modal').src = imgs[index - 1].src;
        document.querySelector('.img_modal').alt = imgs[index - 1].alt;
        document.querySelector('.modal__description').innerHTML = imgs[index - 1].alt;

        index = index - 1;

        if (index === 0){
            previous.style.display = 'none';
        }  
    });
}

(async () => {
    renderCards('Poland');
})();