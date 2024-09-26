const cells = Array.from(document.querySelectorAll('.game__field_miniGrid_cell'));
const digitButtons = Array.from(document.querySelectorAll('.game__controlls_numbers_num'));
const cleanButton = document.querySelector('.game__controlls_top_clean');
const newGameButton = document.querySelector('.game__controlls_newGame');
const mistaksNumber = document.querySelector('.game__controlls_top_mistakes_number');
const timer = document.querySelector('.game__controlls_top_time');

cells.map(cell => {
    cell.addEventListener('click',() => chooseCells(cell));
});

function chooseCells(cell) {
    if (!document.querySelector('.game__field_miniGrid[hover="hover"]')){
        cell.closest('.game__field_miniGrid').setAttribute('hover', 'hover');
        findRowsforHover(cell);
        highlightDigits(cell);
        
    } else {
        clearHoverCells();
        document.querySelector('.game__field_miniGrid[hover="hover"]').removeAttribute('hover', 'hover');
        cell.closest('.game__field_miniGrid').setAttribute('hover', 'hover');
        findRowsforHover(cell);
        highlightDigits(cell);
    }
}

function clearHoverCells() {
    Array.from(document.querySelectorAll('.game__field_miniGrid_cell[hover="hover"]')).forEach(cell => cell.removeAttribute('hover'));
}

function findRowsforHover(cell){
    const numberOfCell = +Array.from(cell.classList)[1];
    const numberOfMiniGrid = +Array.from(cell.closest('.game__field_miniGrid').classList)[1];
    const allMiniGrids = Array.from(document.querySelectorAll('.game__field_miniGrid'));

    const matrixHorizontal = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const matrixVertical = [[1, 4, 7], [2, 5, 8], [3, 6, 9]];

    const arrHorizontalGrid = matrixHorizontal.filter(arr => arr.includes(numberOfMiniGrid)).flatMap((x) => x);
    const arrVerticalGrid = matrixVertical.filter(arr => arr.includes(numberOfMiniGrid)).flatMap((x) => x);
    const arrHorizontalCell = matrixHorizontal.filter(arr => arr.includes(numberOfCell)).flatMap((x) => x);
    const arrVerticalCell = matrixVertical.filter(arr => arr.includes(numberOfCell)).flatMap((x) => x);

    allMiniGrids.map((miniGrid, index) => {
        let number = index + 1;
        if (arrHorizontalGrid.includes(number)){
            Array.from(miniGrid.children).map((cell, index) => {
                if (arrHorizontalCell.includes(index + 1)){
                    cell.setAttribute('hover', 'hover');
                }
            })
        }
        if (arrVerticalGrid.includes(number)) {
            Array.from(miniGrid.children).map((cell, index) => {
                if (arrVerticalCell.includes(index + 1)){
                    cell.setAttribute('hover', 'hover');
                }
            })
        }
    }) 
}

function highlightDigits(cell) {
    const digit = cell.innerHTML;
    cells.forEach(cell => {
        cell.removeAttribute('checked');
        cell.classList.remove('active');
    })
    cell.setAttribute('checked', 'checked');
    cell.classList.add('active');
    if (digit === '') return;

    cells.forEach(cell => (cell.innerHTML === digit) ? cell.setAttribute('checked', 'checked') : cell);
}

digitButtons.map(digitButton => digitButton.addEventListener('click', () => {
    if (document.querySelectorAll('.game__field_miniGrid_cell[checked="checked"]').length > 1) return;
    const digit = digitButton.innerHTML;
    const checkedCell = document.querySelector('.game__field_miniGrid_cell[checked="checked"]');
    checkedCell.innerHTML = digit;
    checkedCell.style.color = '#3187A2';
    highlightDigits(checkedCell);

    if (document.querySelectorAll('.game__field_miniGrid_cell[checked="checked"]').length === 9) {
        digitButton.classList.add('hide');
    }
}));

cleanButton.addEventListener('click', () => {
    const activeCell = document.querySelector('.active');
    if (activeCell.style.color !== 'rgb(49, 135, 162)') return;
    activeCell.innerHTML = '';

    checkNineCaseofDigit();
});

function checkNineCaseofDigit() {
    let counter = [1, 1, 1, 1, 1, 1, 1, 1, 1];

    cells.forEach(cell => {
        const number = +cell.innerHTML;
        switch (number) {
            case 1:
                counter[0] +=1;
              break;
            case 2:
                counter[1] += 1;
              break;
            case 3:
                counter[2] += 1;
              break;
            case 4:
                counter[3] += 1;
              break;
            case 5:
                counter[4] += 1;
              break;
            case 6:
                counter[5] += 1;
              break;
            case 7:
                counter[6] += 1;
              break;
            case 8:
                counter[7] += 1;
              break;
            case 9:
                counter[8] += 1;
              break;
          }
    });

    counter.forEach((number, index) => {
        if (number === 9){
            Array.from(document.querySelectorAll('.game__controlls_numbers_num')).map(button => {
                if (+button.innerHTML === index + 1){
                    button.classList.remove('hide');
                }
            })
        }
    })
}
