(async () => {
    // state declarations
    const ribbon = document.querySelector('.courusel__ribbon');
    const buttonLeft = document.querySelector('.button_arrow_left');
    const buttonRight = document.querySelector('.button_arrow_right');

    const allPets = await fetchPets();

    let previousState = [];
    let prevStep;
    
    // function declarations
    async function fetchPets() {
        const response = await fetch('../pets.json');
        return await response.json();
    }
    
    function renderCards(pets, place) {
        for (const pet of pets.reverse()) {
            ribbon.insertAdjacentHTML(
                `${place}`,
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
        if (screenCapacity == renderedNumber) return;
        
        const pets = chooseRandomPets(allPets, screenCapacity);
    
        ribbon.innerHTML = '';
        renderCards(pets, 'afterbegin'); 
    }
    
    function queryRenderedPets() {
        const previousResults = document.querySelectorAll('.courusel__ribbon_item_name');
        const previousResultsNames = Array.from(previousResults).map(it => it.innerHTML);
        return previousResultsNames.map(name => allPets.find(animal => animal.name === name));
    }
    
    function remainderPets() {
        const previousResultsNames = previousState.map(it => it.name);
        const filteredAnimals = allPets.filter(animal => !previousResultsNames.includes(animal.name));
        return filteredAnimals;
    }    

    // executable
    addEventListener('resize', renderFirst);
    
    renderFirst();
    previousState = queryRenderedPets();

    buttonRight.addEventListener('click', function() {
        if (prevStep === 'left') {
            previousState = queryRenderedPets().filter((item, index) => index <= (calculateScreenCapacity() - 1));
            ribbon.classList.add('ribbon_scroll');
            ribbon.scrollLeft += document.querySelector('.courusel').clientWidth;
        } else if (prevStep === undefined) {
            const pets = chooseRandomPets(remainderPets(), calculateScreenCapacity());
            ribbon.classList.add('ribbon_scroll');
            renderCards(pets, 'beforeend');
            ribbon.scrollLeft += document.querySelector('.courusel').clientWidth;
        } else if (prevStep === 'right') {
            previousState = (queryRenderedPets()).filter((item, index) => index > (calculateScreenCapacity() - 1));
            const pets = chooseRandomPets(remainderPets(), calculateScreenCapacity());
            renderCards(pets, 'beforeend');
            for (let i = 0; i < calculateScreenCapacity(); i += 1) {
                 ribbon.removeChild(ribbon.firstChild);
            }
            ribbon.classList.remove('ribbon_scroll');
            ribbon.scrollLeft -= document.querySelector('.courusel').clientWidth;
            ribbon.classList.add('ribbon_scroll');
            ribbon.scrollLeft += document.querySelector('.courusel').clientWidth;
        }
        prevStep = 'right';
    });

    buttonLeft.addEventListener('click', function() {
        if (prevStep === 'right') {
            previousState = (queryRenderedPets()).filter((item, index) => index > (calculateScreenCapacity() - 1));
            ribbon.classList.remove('ribbon_scroll');
            ribbon.scrollLeft += document.querySelector('.courusel').clientWidth;
            ribbon.classList.add('ribbon_scroll');
            ribbon.scrollLeft -= document.querySelector('.courusel').clientWidth;
        } else if (prevStep === undefined) {
            const pets = chooseRandomPets(remainderPets(), calculateScreenCapacity());
            renderCards(pets, 'afterbegin');
            ribbon.classList.remove('ribbon_scroll');
            ribbon.scrollLeft += document.querySelector('.courusel').clientWidth;
            ribbon.classList.add('ribbon_scroll');
            ribbon.scrollLeft -= document.querySelector('.courusel').clientWidth;
        } else if (prevStep === 'left') {
            previousState = (queryRenderedPets()).filter((item, index) => index <= (calculateScreenCapacity() - 1));
            const pets = chooseRandomPets(remainderPets(), calculateScreenCapacity());
            renderCards(pets, 'afterbegin');
            for (let i = 0; i < calculateScreenCapacity(); i += 1) {
                 ribbon.removeChild(ribbon.lastChild);
            }
            ribbon.classList.remove('ribbon_scroll');
            ribbon.scrollLeft += document.querySelector('.courusel').clientWidth;
            ribbon.classList.add('ribbon_scroll');
            ribbon.scrollLeft -= document.querySelector('.courusel').clientWidth;
        }
        prevStep = 'left';
    });
})();
