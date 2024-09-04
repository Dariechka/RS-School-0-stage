import openModal from './modal.js';

(async () => {
    // state declarations
    const ribbon = document.querySelector('.courusel__ribbon');
    const buttonLeft = document.querySelector('.button_arrow_left');
    const buttonRight = document.querySelector('.button_arrow_right');

    const allPets = await fetchPets();

    let previousState = [];
    let prevStep;

    let skipClick = false;
    
    // function declarations
    async function fetchPets() {
        const response = await fetch('./pets.json');
        return await response.json();
    }
    
    function renderCards(pets, place) {
        const getCardId = (pet) => pet.name + '_card';
        const cardsHtml = pets.map(pet =>
            `<div id="${getCardId(pet)}" class="courusel__ribbon_item">
                    <div class="courusel__ribbon_item_img">
                       <img src="${pet.imgCard}" alt="${pet.name}" class="img"></img> 
                    </div>
                    <h3 class="courusel__ribbon_item_name">${pet.name}</h3>
                    <button class="button courusel__ribbon_item_button">Learn more</button>
                </div>`
        ).join('');
        ribbon.insertAdjacentHTML(place, cardsHtml);

        const cards = [...ribbon.children];
        for (const pet of pets) {
            const card = cards.find(card => card.id === getCardId(pet));
            card.addEventListener('click', (event) => {
                openModal(pet);
                event.stopPropagation();
            });
        }
    }

    function scroll(translation, immediate = false) {
        for (const card of ribbon.children) {
            if (immediate) {
                card.classList.remove('ribbon_scroll');
            } else {
                card.classList.add('ribbon_scroll');
            }
            card.style.transform = 'translateX(' + translation + 'px)';
        }
    }

    async function cleanup(cards, timeout) {
        return await new Promise(resolve => setTimeout(() => {
            for (const card of cards) {
                card.remove();
            }
            scroll(0, true);

            resolve();
        }, timeout));
    }
    
    function calculateScreenCapacity() {
        if (ribbon.getBoundingClientRect().width > 580) {
           return 3;
        } else if (ribbon.getBoundingClientRect().width > 270) {
           return 2;
        } else {
           return 1;
        }
    }
    
    function chooseRandomPets(pets, number) {
        if (pets.length <= number) return pets;
    
        const cloned = [...pets];
    
        const result = [];
        while (result.length < number) {
            const index = Math.floor(Math.random() * cloned.length);
            result.push(...cloned.splice(index, 1));
        }
    
        return result;
    }
    
    function renderFirst() {
        const renderedNumber = document.querySelectorAll('.courusel__ribbon_item').length;
        const screenCapacity = calculateScreenCapacity();
        if (screenCapacity === renderedNumber) return;
        const pets = chooseRandomPets(allPets, screenCapacity);

        ribbon.innerHTML = '';
        renderCards(pets, 'afterbegin');

        prevStep = null;
        previousState = [];
    }
    
    function queryPets() {
        const renderedPetNameNodes = document.querySelectorAll('.courusel__ribbon_item_name');
        const renderedPetNames = Array.from(renderedPetNameNodes).map(it => it.innerHTML);
        const renderedPets = renderedPetNames.map(name => allPets.find(animal => animal.name === name));
        return {
            renderedPets: renderedPets,
            nonRenderedPets: allPets.filter(pet => !renderedPets.includes(pet))
        };
    }

    function calculateScrollLength() {
        const screenCapacity = calculateScreenCapacity();
        if (screenCapacity === 1) {
            return 270;
        }
        const ribbonWidth = ribbon.clientWidth;
        const gapWidth = (ribbonWidth - 270 * screenCapacity) / (screenCapacity - 1);
        return ribbon.clientWidth + gapWidth;
    }

    async function renderPets(pets, place) {
        const {renderedPets} = queryPets();
        const scrollLength = calculateScrollLength();
        const cardsToRemove = [...ribbon.children];

        // render new cards
        renderCards(pets, place);
        // after rendering, ensure displayed cards are the same by immediately scrolling to them if necessary to adjust
        scroll(place === 'beforeend' ? 0 : -scrollLength, true);
        // do animated scroll to newly rendered cards (inside setTimeout to ensure that previous adjusting scroll was applied)
        setTimeout(() => scroll(place === 'beforeend' ? -scrollLength : 0), 0);
        // cleanup originaly displayed cards after 500ms (since transition time is set to 500ms)
        await cleanup(cardsToRemove, 500);

        previousState = renderedPets;
    }

    // executable
    addEventListener('resize', renderFirst);
    renderFirst();

    buttonRight.addEventListener('click', async function() {
        if (skipClick) {
            return;
        }
        skipClick = true;

        if (prevStep === 'left') {
            await renderPets(previousState, 'beforeend');
        } else {
            const {nonRenderedPets} = queryPets();
            const petsToRender = chooseRandomPets(nonRenderedPets, calculateScreenCapacity());
            await renderPets(petsToRender, 'beforeend');
        }
        prevStep = 'right';

        skipClick = false;
    });

    buttonLeft.addEventListener('click', async function() {
        if (skipClick) {
            return;
        }
        skipClick = true;

        if (prevStep === 'right') {
            await renderPets(previousState, 'afterbegin');
        } else {
            const {nonRenderedPets} = queryPets();
            const petsToRender = chooseRandomPets(nonRenderedPets, calculateScreenCapacity());
            await renderPets(petsToRender, 'afterbegin');
        }
        prevStep = 'left';

        skipClick = false;
    });
})();
