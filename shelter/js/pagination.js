import openModal from './modal.js';

(async () => {
    const ribbon = document.querySelector('.courusel__ribbon_pets');
    const number = document.querySelector('.courusel__pages_number');
    const buttonLeftDouble = document.querySelector('.button_arrow_left_double');
    const buttonLeftSingle = document.querySelector('.button_arrow_left_single');
    const buttonRightDouble = document.querySelector('.button_arrow_right_double');
    const buttonRightSingle = document.querySelector('.button_arrow_right_single');

    const state = {
        pets: shuffle(await fetchPets()),

        _offset: 0,
        get offset() {
            return this._offset;
        },
        set offset(value) {
            this._offset = value;
            render();
        }
    }

    function render() {
        renderCards();
        updateButtonsState();
    }

    async function fetchPets() {
        const response = await fetch('../pets.json');
        return await response.json();
    }

    function shuffle(arr) {
        function shuffleInternal(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

        const forReturn = []
        while (forReturn.length < 48) {
            let clone = [...arr];
            let result = [];
            let rest = [];

            clone = shuffleInternal(clone);
            let copy = [...clone];

            result.push(...clone.splice(0, 6));

            copy = copy.filter(item => !clone.includes(item));
            copy = shuffleInternal(copy);
            copy = shuffleInternal(copy);

            rest.push(...copy.splice(copy.length - 2, 2));

            result.push(...clone, ...copy, ...rest, ...clone);
            copy = shuffleInternal(copy);

            result.push(...copy, ...clone, ...rest);
            forReturn.push(...result);
        }
        return forReturn;
    }

    function calculateScreenCapacity() {
        if (ribbon.getBoundingClientRect().width === 1200) {
            return 8;
        } else if (ribbon.getBoundingClientRect().width < 1200 && ribbon.getBoundingClientRect().width > 579) {
            return 6;
        } else {
            return 3;
        }
    }

    function resizePage() {
        const renderedNumber = document.querySelectorAll('.courusel__ribbon_item').length;
        const  capacity = calculateScreenCapacity();
        if (capacity === renderedNumber) return;

        const lowerOffsetVariant = Math.floor(state.offset / capacity) * capacity;
        const upperOffsetVariant = Math.ceil(state.offset / capacity) * capacity;

        if (Math.abs(state.offset - lowerOffsetVariant) <= Math.abs(state.offset - upperOffsetVariant)) {
            state.offset = lowerOffsetVariant;
        } else {
            state.offset = upperOffsetVariant;
        }
    }

    function renderCards() {
        ribbon.innerHTML = '';
        const petsSlice = state.pets.slice(state.offset, state.offset + calculateScreenCapacity());
        const getCardId = (pet) => pet.name + '_card';

        const cardsHtml = petsSlice.map(pet =>
            `<div id="${getCardId(pet)}" class="courusel__ribbon_item">
                    <div class="courusel__ribbon_item_img">
                       <img src="${pet.imgCard}" alt="${pet.name}" class="img"></img> 
                    </div>
                    <h3 class="courusel__ribbon_item_name">${pet.name}</h3>
                    <button class="button courusel__ribbon_item_button">Learn more</button>
                </div>`
        ).join('');
        ribbon.insertAdjacentHTML('beforeend', cardsHtml);

        const cards = [...ribbon.children];
        for (const pet of petsSlice) {
            const card = cards.find(card => card.id === getCardId(pet));
            card.addEventListener('click', () => openModal(pet));
        }
    }

    function updateButtonsState() {
        const capacity = calculateScreenCapacity();
        number.innerHTML = state.offset / capacity + 1;

        if (state.offset === state.pets.length - capacity) {
            buttonRightDouble.disabled = true;
            buttonRightSingle.disabled = true;
    
            buttonLeftDouble.disabled = false;
            buttonLeftSingle.disabled = false;
    
        } else if (state.offset === 0) {
            buttonRightDouble.disabled = false;
            buttonRightSingle.disabled = false;

            buttonLeftDouble.disabled = true;
            buttonLeftSingle.disabled = true;
        } else {
            buttonRightDouble.disabled = false;
            buttonRightSingle.disabled = false;

            buttonLeftDouble.disabled = false;
            buttonLeftSingle.disabled = false;
        }
    }

    render();
    addEventListener('resize', resizePage);

    buttonRightSingle.addEventListener('click', function() {
        const capacity = calculateScreenCapacity();
        state.offset += capacity;
    })

    buttonLeftSingle.addEventListener('click', function() {
        const capacity = calculateScreenCapacity();
        state.offset -= capacity;
    })

    buttonRightDouble.addEventListener('click', function() {
        const capacity = calculateScreenCapacity();
        state.offset = state.pets.length - capacity;
    })

    buttonLeftDouble.addEventListener('click', function() {
        state.offset = 0;
    })
})();
