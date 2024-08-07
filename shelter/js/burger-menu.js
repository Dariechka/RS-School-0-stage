const menu = document.querySelector('.burger-menu');
const button = document.querySelector('.header__burger-menu');
const body = document.body;
const links = document.querySelectorAll('.burger-menu__navigation_item');
const background= document.querySelector('.background');

for (let link of links) {
    link.addEventListener('click', function() {
        button.removeAttribute('data-open');
        menu.removeAttribute('data-open');
        body.classList.remove('no-scroll');
    });
}

button.addEventListener('click', function () {
    function closeMenu(event) {
        if (event.target == button || event.target.closest('.burger-menu')) {
            return;
        }
        menu.removeAttribute('data-open');
        button.removeAttribute('data-open');
        body.classList.remove('no-scroll');
        background.style.display = 'none';
        removeEventListener('click', closeMenu);
    };

    if (!button.hasAttribute('data-open')) {
        menu.setAttribute('data-open', '');
        button.setAttribute('data-open', '');
        body.classList.add('no-scroll');
        background.style.display = 'block';
        body.addEventListener('click', closeMenu);
    } else {
        closeMenu();
        removeEventListener('click', closeMenu);
    }
});
