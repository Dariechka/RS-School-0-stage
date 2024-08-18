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
        for (const pet of pets) {
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

    function scroll(place) {
        switch (place) {
            case 'beforeend': {
                ribbon.classList.remove('ribbon_scroll');
                ribbon.scrollLeft -= calculateScrollLength()//document.querySelector('.courusel').clientWidth;
                ribbon.classList.add('ribbon_scroll');
                ribbon.scrollLeft += calculateScrollLength()//document.querySelector('.courusel').clientWidth;
            }
            break;
            case 'afterbegin': {
                ribbon.classList.remove('ribbon_scroll');
                ribbon.scrollLeft += calculateScrollLength()//document.querySelector('.courusel').clientWidth;
                ribbon.classList.add('ribbon_scroll');
                ribbon.scrollLeft -= calculateScrollLength()//document.querySelector('.courusel').clientWidth;
            }
            break;
        }
    }

    async function cleanup(place) {
        return await new Promise(resolve => setTimeout(() => {
            switch (place) {
                case 'beforeend': {
                    for (let i = 0; i < calculateScreenCapacity(); i += 1) {
                        ribbon.removeChild(ribbon.firstChild);
                    }
                    ribbon.classList.remove('ribbon_scroll');
                    ribbon.scrollLeft -= calculateScrollLength()//document.querySelector('.courusel').clientWidth;
                }
                break;
                case 'afterbegin': {
                    for (let i = 0; i < calculateScreenCapacity(); i += 1) {
                        ribbon.removeChild(ribbon.lastChild);
                    }
                    ribbon.classList.remove('ribbon_scroll');
                    ribbon.scrollLeft += calculateScrollLength()//document.querySelector('.courusel').clientWidth;
                }
                break;
            }

            resolve();
        }, 100));
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
        previousState = null;
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
        // const screenCapacity = calculateScreenCapacity();
        // return screenCapacity === 1 ? 270 : 270 * screenCapacity + 40 * (screenCapacity - 1);
        return document.querySelector('.courusel').clientWidth;
    }

    async function renderPets(pets, place) {
        const {renderedPets} = queryPets();

        renderCards(place === 'beforeend' ? pets : pets.reverse(), place);
        scroll(place);
        await cleanup(place);

        previousState = renderedPets;
    }

    // executable
    addEventListener('resize', renderFirst);
    renderFirst();

    buttonRight.addEventListener('click', async function() {
        if (prevStep === 'left') {
            await renderPets(previousState, 'beforeend');
        } else {
            const {nonRenderedPets} = queryPets();
            const petsToRender = chooseRandomPets(nonRenderedPets, calculateScreenCapacity());
            await renderPets(petsToRender, 'beforeend');
        }
        prevStep = 'right';
    });

    buttonLeft.addEventListener('click', async function() {
        if (prevStep === 'right') {
            await renderPets(previousState, 'afterbegin');
        } else {
            const {nonRenderedPets} = queryPets();
            const petsToRender = chooseRandomPets(nonRenderedPets, calculateScreenCapacity());
            await renderPets(petsToRender, 'afterbegin');
        }
        prevStep = 'left';
    });
})();
