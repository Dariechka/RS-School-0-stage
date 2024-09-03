export default function openModal(pet) {
    const body = document.body;
    const background = document.querySelector('.background');

    body.classList.add('no-scroll');
    background.style.display = 'block';

    body.insertAdjacentHTML(
        `afterbegin`,
        `<div class="modal__window">
            <button class="modal__close" type="submit">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M7.42618 6.00003L11.7046 1.72158C12.0985 1.32775 12.0985 0.689213 11.7046 0.295433C11.3108 -0.0984027 10.6723 -0.0984027 10.2785 0.295433L5.99998 4.57394L1.72148 0.295377C1.32765 -0.098459 0.68917 -0.098459 0.295334 0.295377C-0.0984448 0.689213 -0.0984448 1.32775 0.295334 1.72153L4.57383 5.99997L0.295334 10.2785C-0.0984448 10.6723 -0.0984448 11.3108 0.295334 11.7046C0.68917 12.0985 1.32765 12.0985 1.72148 11.7046L5.99998 7.42612L10.2785 11.7046C10.6723 12.0985 11.3108 12.0985 11.7046 11.7046C12.0985 11.3108 12.0985 10.6723 11.7046 10.2785L7.42618 6.00003Z"
                        fill="#292929" />
                </svg>
            </button>
            <div class="modal__img">
                <img src="${pet.imgModal}" alt="${pet.name}" class="img">
            </div>
            <div class="modal__text">
                <h3 class="modal__text_name">${pet.name}</h3>
                <h4 class="modal__text_brid">${pet.type} - ${pet.breed}</h4>
                <p class="modal__text_description">${pet.description}</p>
                <ul class="modal__text_list">
                    <li class="modal__text_list_item"><strong class="modal__text_list_strong">Age:</strong> ${pet.age}</li>
                    <li class="modal__text_list_item"><strong class="modal__text_list_strong">Inoculations:</strong> ${pet.inoculations.join(', ')}</li>
                    <li class="modal__text_list_item"><strong class="modal__text_list_strong">Diseases:</strong> ${pet.diseases.join(', ')}</li>
                    <li class="modal__text_list_item"><strong class="modal__text_list_strong">Parasites:</strong> ${pet.parasites.join(', ')}</li>
                </ul>
            </div>
        </div>`
    );
    const modal = document.querySelector('.modal__window');

    const closeButton = document.querySelector('.modal__close');
    closeButton.addEventListener('click', function() {
         modal.remove();
         body.classList.remove('no-scroll');
         background.style.display = 'none';
    });
}