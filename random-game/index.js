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
    cells.forEach(cell => cell.removeAttribute('checked'));
    cell.setAttribute('checked', 'checked');
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
}));
