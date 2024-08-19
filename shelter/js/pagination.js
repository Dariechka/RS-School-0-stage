(async () => {
    // state declarations
    const ribbon = document.querySelector('.courusel__ribbon_pets');
    const number = document.querySelector('.courusel__pages_number');
    const buttonLeftDouble = document.querySelector('.button_arrow_left_double');
    const buttonLeftSingle = document.querySelector('.button_arrow_left_single');
    const buttonLeftDoubleDisabled = document.querySelector('.button_arrow_left_double[disabled]');
    const buttonLeftSingleDisabled = document.querySelector('.button_arrow_left_single[disabled]');
    const buttonRightDouble = document.querySelector('.button_arrow_right_double');
    const buttonRightSingle = document.querySelector('.button_arrow_right_single');
    const buttonRightDoubleDisabled = document.querySelector('.button_arrow_right_double[disabled]');
    const buttonRightSingleDisabled = document.querySelector('.button_arrow_right_single[disabled]');

    const allPets = await fetchPets();

    async function fetchPets() {
        const response = await fetch('../pets.json');
        return await response.json();
    }

    function renderCards(pets, place) {
        for (const pet of pets) {
            ribbon.insertAdjacentHTML(
                `${place}`,
                `<div class="courusel__ribbon_item">
                    <div class="courusel__ribbon_item_img">
                       <img src="../pictures/${pet.name}.png" alt="${pet.name}" class="img"></img> 
                    </div>
                    <h3 class="courusel__ribbon_item_name">${pet.name}</h3>
                    <button class="button courusel__ribbon_item_button">Learn more</button>
                </div>`
            );
        }
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

    function shufflePets(pets) {
        function shuffle(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        }

        const forReturn = []
        while (forReturn.length < 48) {
            let clone = [...pets];
            let result = [];
            let rest = [];

            clone = shuffle(clone);
            let copy = [...clone];

            result.push(...clone.splice(0, 6));

            copy = copy.filter(item => !clone.includes(item));
            copy = shuffle(copy);

            rest.push(...copy.splice(copy.length - 2, 2));

            result.push(...clone, ...copy, ...rest, ...clone);
            copy = shuffle(copy);

            result.push(...copy, ...clone, ...rest);
            forReturn.push(...result);
        }
        return forReturn;
    }

    function checkButtons(step) {
        if (step === 48){
            buttonRightDouble.hidden = true;
            buttonRightSingle.hidden = true;
            buttonRightDoubleDisabled.hidden = false;
            buttonRightSingleDisabled.hidden = false;
    
            buttonLeftDouble.hidden = false;
            buttonLeftSingle.hidden = false;
            buttonLeftDoubleDisabled.hidden = true;
            buttonLeftSingleDisabled.hidden = true;
    
        } else if (step <= 8){
            buttonLeftDouble.hidden = true;
            buttonLeftSingle.hidden = true;
            buttonLeftDoubleDisabled.hidden = false;
            buttonLeftSingleDisabled.hidden = false;
    
            buttonRightDouble.hidden = false;
            buttonRightSingle.hidden = false;
            buttonRightDoubleDisabled.hidden = true;
            buttonRightSingleDisabled.hidden = true;
        } else {
            buttonLeftDouble.hidden = false;
            buttonLeftSingle.hidden = false;
            buttonLeftDoubleDisabled.hidden = true;
            buttonLeftSingleDisabled.hidden = true;
    
            buttonRightDouble.hidden = false;
            buttonRightSingle.hidden = false;
            buttonRightDoubleDisabled.hidden = true;
            buttonRightSingleDisabled.hidden = true;
        }
    }

    function renderFirst(pets, place){
        number.innerHTML = '1';
        renderCards(pets, place);
    }

    // executable
    const allShuffledPets = shufflePets(allPets);
    let step = 0;
    checkButtons(step);

    addEventListener('resize', () => renderFirst(allShuffledPets.slice(step, calculateScreenCapacity()), 'afterbegin'));
    renderFirst(allShuffledPets.slice(step, 8), 'afterbegin');
    step += calculateScreenCapacity();

    buttonRightSingle.addEventListener('click', function(){
        number.innerHTML =  +number.innerHTML + 1;
        for (let i = 0; i < calculateScreenCapacity(); i+= 1) {
            ribbon.removeChild(ribbon.firstChild);
        }
        renderCards(allShuffledPets.slice(step, step + calculateScreenCapacity()), 'afterbegin');
        step += calculateScreenCapacity();
        checkButtons(step);
    })

    buttonLeftSingle.addEventListener('click', function(){
        number.innerHTML =  +number.innerHTML - 1;
        for (let i = 0; i < calculateScreenCapacity(); i+= 1) {
            ribbon.removeChild(ribbon.firstChild);
        }
        renderCards(allShuffledPets.slice(step - calculateScreenCapacity(), step), 'afterbegin');
        step -= calculateScreenCapacity();
        checkButtons(step);
    })

    buttonRightDouble.addEventListener('click', function(){
        number.innerHTML = allShuffledPets.length/calculateScreenCapacity();
        for (let i = 0; i < calculateScreenCapacity(); i+= 1) {
            ribbon.removeChild(ribbon.firstChild);
        }
        renderCards(allShuffledPets.slice((allShuffledPets.length - 9), 48), 'afterbegin');
        step = 48;
        checkButtons(step);
    })

    buttonLeftDouble.addEventListener('click', function(){
        number.innerHTML = '1';
        for (let i = 0; i < calculateScreenCapacity(); i+= 1) {
            ribbon.removeChild(ribbon.firstChild);
        }
        renderCards(allShuffledPets.slice(0, 8), 'afterbegin');
        step = 8;
        checkButtons(step);
    })


})();