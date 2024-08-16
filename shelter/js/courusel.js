let previousState = [];
let prevStep;

(async () => {
    addEventListener("resize", renderFirst);

    await renderFirst();


    const buttonLeft = document.querySelector('.button_arrow_left');
    const buttonRight = document.querySelector('.button_arrow_right');


    buttonRight.addEventListener('click', async function(){
        if (prevStep === 'left') {
            let current = await queryRenderedPets();
            renderCards(previousState);
            previousState = current;
        } else {
            previousState = await queryRenderedPets();
            await renderSecond();
        }
        prevStep = 'right';
    });
    buttonLeft.addEventListener('click', async function(){
        if (prevStep === 'right') {
            let current = await queryRenderedPets();
            renderCards(previousState);
            previousState = current;
        } else {
            previousState = await queryRenderedPets();
            await renderSecond();
        }
        prevStep = 'left';
    });
})();

async function fetchPets() {
    const response = await fetch('../pets.json');
    return await response.json();
}

function chooseRandomPets(pets, number) {
    //if (pets.length <= number) return pets;

    const cloned = [...pets];

    const result = [];
    while (result.length < number) {
        const index = Math.floor(Math.random() * cloned.length);
        result.push(...cloned.splice(index, 1));
    }
    saveFirstStep = [...result];
    return result;
}

function calculateNumber() {
    const ribbon = document.querySelector('.courusel__ribbon');

    let number;
    if (ribbon.getBoundingClientRect().width > 580) {
       return number = 3;
    } else if (ribbon.getBoundingClientRect().width > 270) {
       return number = 2;
    } else {
       return number = 1;
    }
}

function renderCards(pets) {
    document.querySelector('.courusel__ribbon').innerHTML = '';
    for (const pet of pets.reverse()) {
        document.querySelector('.courusel__ribbon').insertAdjacentHTML(
            "afterbegin",
            `<div class="courusel__ribbon_item">
                <div class="courusel__ribbon_item_img">
                   <img src="../pictures/${pet.name}.png" alt="katrine" class="img"></img> 
                </div>
                <h3 class="courusel__ribbon_item_name">${pet.name}</h3>
                <button class="button courusel__ribbon_item_button">Learn more</button>
            </div>`
        );
    }
}

async function renderFirst() {
    const renderedNumber = document.querySelectorAll('.courusel__ribbon_item').length;
    if (calculateNumber() == renderedNumber) return;
    
    const pets = chooseRandomPets(await fetchPets(), calculateNumber());

    renderCards(pets);
    
}

async function renderSecond() {
    const previousResults = document.querySelectorAll('.courusel__ribbon_item_name');
    const previousResultsNames = Array.from(previousResults).map(it => it.innerHTML)
    const animals = await fetchPets();
    const filteredAnimals = animals.filter(animal => !previousResultsNames.includes(animal.name));
    const pets = chooseRandomPets(filteredAnimals, calculateNumber());
    renderCards(pets);
}

async function queryRenderedPets() {
    const previousResults = document.querySelectorAll('.courusel__ribbon_item_name');
    const previousResultsNames = Array.from(previousResults).map(it => it.innerHTML)
    const animals = await fetchPets();
    return previousResultsNames.map(name => animals.find(animal => animal.name === name));
}
