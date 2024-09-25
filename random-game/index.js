const cells = Array.from(document.querySelectorAll('.game__field_miniGrid_cell'));

cells.map(cell => {
    cell.addEventListener('click',() => makeCellsHover(cell));
});

function makeCellsHover(cell) {
    if (!document.querySelector('.game__field_miniGrid[hover="hover"]')){
        cell.closest('.game__field_miniGrid').setAttribute('hover', 'hover');
        findRowsforHover(cell);
    } else {
        clearHoverCells();
        document.querySelector('.game__field_miniGrid[hover="hover"]').removeAttribute('hover', 'hover');
        cell.closest('.game__field_miniGrid').setAttribute('hover', 'hover');
        findRowsforHover(cell);
    }
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

function clearHoverCells() {
    Array.from(document.querySelectorAll('.game__field_miniGrid_cell[hover="hover"]')).forEach(cell => cell.removeAttribute('hover'));
}