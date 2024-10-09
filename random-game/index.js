(async () => {
    const wraper = document.querySelector('.game__field');
    const digitButtons = Array.from(document.querySelectorAll('.game__controlls_numbers_num'));
    const cleanButton = document.querySelector('.game__controlls_top_clean');
    const newGameButton = document.querySelector('.game__controlls_newGame');
    const mistakesNumber = document.querySelector('.game__controlls_top_mistakes_number');
    const timer = document.querySelector('.game__controlls_top_time');
    const play = document.querySelector('.play');
    const pause = document.querySelector('.pause');
    const rules = document.querySelector('.rules');
    const results = document.querySelector('.results');
    const fields = await fetchFields();
    const usedFields = [];

    let sec = 0;
    let paused = false;
    let intervalId;

    function queryCells() {
        return Array.from(document.querySelectorAll('.game__field_miniGrid_cell'));
    }

    function queryMiniGrids() {
        return Array.from(document.querySelectorAll('.game__field_miniGrid'));
    }

    //fetch fields and choose one for game
    async function fetchFields() {
        const response = await fetch('./fields.json');
        return await response.json();
    }

    function getNextGameField() {
        if (usedFields.length === fields.length) {
            usedFields.splice(0, usedFields.length);
        }
        const unusedFields = [...new Set(fields).difference(new Set(usedFields))];
        const indexOfField = Math.floor(unusedFields.length * Math.random());
        const field = unusedFields[indexOfField];
        usedFields.push(field);
        return field;
    }

    //get and save state in localstorage
    const gameResultsStorageKey = 'gameResults';
    function getGameState() {
        return JSON.parse(
            localStorage.getItem(gameResultsStorageKey) || `{
                "counter": 0,
                "top": []
            }`
        );
    }
    function saveGameResult(time, mistakes) {
        pauseTimer(); // stop game timer on win

        const state = getGameState();
        state.counter++;
        const lastGame = {
            number: state.counter,
            mistakes,
            time
        };
        state.top.push(lastGame);
        state.top.sort((a, b) => a.time - b.time);
        state.top = state.top.slice(0, 10);
        localStorage.setItem(gameResultsStorageKey, JSON.stringify(state));
        return lastGame;
    }

    //functions for timer
    function renderTime(time) {
        const sec = (time % 60).toString().padStart(2, '0');
        const min = (Math.floor(time / 60)).toString().padStart(2, '0');
        return `${min}:${sec}`;
    }
    function startTimer() {
        function updateTimer() {
            if (paused) {
                return;
            }
            sec++;
            timer.innerHTML = renderTime(sec);
        }
        if (intervalId) {
            clearInterval(intervalId);
        }
        sec = 0;
        timer.innerHTML = renderTime(sec);
        playTimer();
        intervalId = setInterval(updateTimer, 1000);
    }

    //functions for hover and highlight cells, find mistakes
    function chooseCell(cell) {
        if(document.querySelectorAll('.error').length > 0) return;
        if (!document.querySelector('.game__field_miniGrid[hover="hover"]')) {
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

    function highlightDigits(cell) {
        const digit = cell.innerHTML;
        queryCells().forEach(cell => {
            cell.removeAttribute('checked');
            cell.classList.remove('active');
        })
        cell.setAttribute('checked', 'checked');
        cell.classList.add('active');
        if (digit === '') return;

        queryCells().forEach(cell => (cell.innerHTML === digit) ? cell.setAttribute('checked', 'checked') : cell);
    }

    function findRowsforHover(cell) {
        const numberOfCell = +Array.from(cell.classList)[1];
        const numberOfMiniGrid = +Array.from(cell.closest('.game__field_miniGrid').classList)[1];

        const matrixHorizontal = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
        const matrixVertical = [[1, 4, 7], [2, 5, 8], [3, 6, 9]];

        const arrHorizontalGrid = matrixHorizontal.filter(arr => arr.includes(numberOfMiniGrid)).flatMap((x) => x);
        const arrVerticalGrid = matrixVertical.filter(arr => arr.includes(numberOfMiniGrid)).flatMap((x) => x);
        const arrHorizontalCell = matrixHorizontal.filter(arr => arr.includes(numberOfCell)).flatMap((x) => x);
        const arrVerticalCell = matrixVertical.filter(arr => arr.includes(numberOfCell)).flatMap((x) => x);


        queryMiniGrids().map((miniGrid, index) => {
            let number = index + 1;
            if (arrHorizontalGrid.includes(number)) {
                Array.from(miniGrid.children).map((cell, index) => {
                    if (arrHorizontalCell.includes(index + 1)) {
                        cell.setAttribute('hover', 'hover');
                    }
                })
            }
            if (arrVerticalGrid.includes(number)) {
                Array.from(miniGrid.children).map((cell, index) => {
                    if (arrVerticalCell.includes(index + 1)) {
                        cell.setAttribute('hover', 'hover');
                    }
                })
            }
        })
    }

    function checkNineCaseofDigit() {
        let counter = [0, 0, 0, 0, 0, 0, 0, 0, 0];

        queryCells().forEach(cell => {
            const number = +cell.innerHTML;
            switch (number) {
                case 1:
                    counter[0] += 1;
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
            if (number === 8) {
                Array.from(document.querySelectorAll('.game__controlls_numbers_num')).map(button => {
                    if (+button.innerHTML === index + 1) {
                        button.classList.remove('hide');
                    }
                })
            }
        })
    }

    function checkMistakes(cell) {
        const digitOfChooseCell = cell.innerHTML;
        const numberOfCell = +Array.from(cell.classList)[1];
        const numberOfMiniGrid = +Array.from(cell.closest('.game__field_miniGrid').classList)[1];

        const matrixHorizontal = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
        const matrixVertical = [[1, 4, 7], [2, 5, 8], [3, 6, 9]];

        const arrHorizontalGrid = matrixHorizontal.filter(arr => arr.includes(numberOfMiniGrid)).flatMap((x) => x);
        const arrVerticalGrid = matrixVertical.filter(arr => arr.includes(numberOfMiniGrid)).flatMap((x) => x);
        const arrHorizontalCell = matrixHorizontal.filter(arr => arr.includes(numberOfCell)).flatMap((x) => x);
        const arrVerticalCell = matrixVertical.filter(arr => arr.includes(numberOfCell)).flatMap((x) => x);

        queryMiniGrids().map((miniGrid, index) => {
            let number = index + 1;
            if (arrHorizontalGrid.includes(number)) {
                Array.from(miniGrid.children).map((cell, index) => {
                    if (arrHorizontalCell.includes(index + 1)) {
                        if (cell.innerHTML === digitOfChooseCell) {
                            cell.removeAttribute('checked', 'checked');
                            cell.removeAttribute('hover', 'hover');
                            cell.classList.add('error');
                        }
                    }
                })
            }
            if (arrVerticalGrid.includes(number)) {
                Array.from(miniGrid.children).map((cell, index) => {
                    if (arrVerticalCell.includes(index + 1)) {
                        if (cell.innerHTML === digitOfChooseCell) {
                            cell.removeAttribute('checked', 'checked');
                            cell.removeAttribute('hover', 'hover');
                            cell.classList.add('error');
                        }
                    }
                })
            }
        });

        let miniGridofCell = cell.closest('.game__field_miniGrid');
        for (let item of Array.from(miniGridofCell.children)) {
            if (item.innerHTML === cell.innerHTML && Array.from(item.classList)[1] !== Array.from(cell.classList)[1]){
                item.removeAttribute('checked', 'checked');
                item.removeAttribute('hover', 'hover');
                item.classList.add('error');
            }
        }

        if (document.querySelectorAll('.error').length > 1) {
            cell.removeAttribute('checked', 'checked');
            cell.removeAttribute('hover', 'hover');
            cell.classList.add('error');
            mistakesNumber.textContent = +mistakesNumber.textContent + 1
        }

        if (document.querySelectorAll('.error').length === 1) {
            cell.classList.remove('error');
        }

        if (+mistakesNumber.textContent === 3) {
            mistakesNumber.classList.add('error');
            openModal();
        }
    }

    //for modals
    function openModal(){
        document.querySelector('.audio-mistake').play();
        pauseTimer();
        document.body.insertAdjacentHTML(
            `afterbegin`,
        `<div class="modal__window fail">
            <div class="modal__window_img">
                <img src="./assets/img/potracheno.png" alt="wasted" class="img">
            </div>
            <button class="game__controlls_newGame">New Game</button>
        </div>`);
        document.querySelector('.game__controlls_newGame').addEventListener('click', startGame);
    }

    function openResults(lastGame) {
        document.body.insertAdjacentHTML(
            `afterbegin`,
        `<div class="modal__window openedResults">
            <h2 class="modal__text">The history of your successful games</h2>
            <div class="modal__grid">
                <div class="modal__grid_cell">Game number</div>
                <div class="modal__grid_cell">Number of errors</div>
                <div class="modal__grid_cell">Time</div>
                <div class="modal__grid_cell round"></div>
                <div class="modal__grid_cell input mistakes"></div>
                <div class="modal__grid_cell input time"></div>
                <div class="modal__grid_cell round"></div>
                <div class="modal__grid_cell input mistakes"></div>
                <div class="modal__grid_cell input time"></div>
                <div class="modal__grid_cell round"></div>
                <div class="modal__grid_cell input mistakes"></div>
                <div class="modal__grid_cell input time"></div>
                <div class="modal__grid_cell round"></div>
                <div class="modal__grid_cell input mistakes"></div>
                <div class="modal__grid_cell input time"></div>
                <div class="modal__grid_cell round"></div>
                <div class="modal__grid_cell input mistakes"></div>
                <div class="modal__grid_cell input time"></div>
                <div class="modal__grid_cell round"></div>
                <div class="modal__grid_cell input mistakes"></div>
                <div class="modal__grid_cell input time"></div>
                <div class="modal__grid_cell round"></div>
                <div class="modal__grid_cell input mistakes"></div>
                <div class="modal__grid_cell input time"></div>
                <div class="modal__grid_cell round"></div>
                <div class="modal__grid_cell input mistakes"></div>
                <div class="modal__grid_cell input time"></div>
                <div class="modal__grid_cell round"></div>
                <div class="modal__grid_cell input mistakes"></div>
                <div class="modal__grid_cell input time"></div>
                <div class="modal__grid_cell round"></div>
                <div class="modal__grid_cell input mistakes"></div>
                <div class="modal__grid_cell input time"></div>
                <div class="modal__grid_cell round"></div>
                <div class="modal__grid_cell input mistakes"></div>
                <div class="modal__grid_cell input time"></div>
            </div>
            <button class="modal__button">Wow!</button>
        </div>`);
        document.querySelector('.modal__button').addEventListener('click', () => {
            document.querySelector('.modal__window').remove();
        });

        const state = getGameState();
        for (let i = 0; i < state.top.length; i++) {
            const game = state.top[i];
            Array.from(document.querySelectorAll('.round'))[i].innerHTML = `Game_${game.number}`;
            Array.from(document.querySelectorAll('.mistakes'))[i].innerHTML = `${game.mistakes}`;
            Array.from(document.querySelectorAll('.time'))[i].innerHTML = renderTime(game.time);
        }

        if (!lastGame) {
            return;
        } else if (state.top.find(obj => obj.number === lastGame.number)) {
            const toWiteCell = Array.from(document.querySelectorAll('.round')).find(item => item.innerHTML === `Game_${lastGame.number}`);
            toWiteCell.style.backgroundColor = '#FFFFFF';
            toWiteCell.nextSibling.nextSibling.style.backgroundColor = '#FFFFFF';
            toWiteCell.nextSibling.nextSibling.nextSibling.nextSibling.style.backgroundColor = '#FFFFFF';
        } else {
            document.querySelector('.modal__grid').insertAdjacentHTML(
                `beforeend`,
            `
            <div class="modal__grid_cell round" style="background-color: rgb(255, 255, 255)">Game_${lastGame.number}</div>
            <div class="modal__grid_cell input mistakes" style="background-color: rgb(255, 255, 255)">${lastGame.mistakes}</div>
            <div class="modal__grid_cell input time" style="background-color: rgb(255, 255, 255)">${lastGame.time}</div>
            `
            );
        }
    }

    //eventListeners
    cleanButton.addEventListener('click', () => {
        if (isAllCellsPopulated()) {
            return;
        }
        const activeCell = document.querySelector('.active');
        if (activeCell === null) return;
        if (activeCell.style.color !== 'rgb(49, 135, 162)') return;
        activeCell.innerHTML = '';
        Array.from(document.querySelectorAll('.error')).forEach(cell => cell.classList.remove('error'));
        highlightDigits(activeCell);

        checkNineCaseofDigit();
    });

    function isGameInProgress() {
        return !!intervalId;
    }

    function playTimer() {
        document.querySelector('.pause').style.display = 'flex';
        document.querySelector('.play').style.display = 'none';

        document.querySelector('.main').style.display = 'none'
        document.querySelector('.reserve').style.display = 'grid';;
        paused = false;
    }

    play.addEventListener('click', () => {
        if (isAllCellsPopulated() || !isGameInProgress()) {
            return;
        }
        playTimer();
    });

    function pauseTimer() {
        document.querySelector('.play').style.display = 'flex';
        document.querySelector('.pause').style.display = 'none';
        
        document.querySelector('.reserve').style.display = 'none';
        document.querySelector('.main').style.display = 'grid';
        paused = true;
    }
    pause.addEventListener('click', () => {
        if (!isGameInProgress()) {
            return;
        }
        pauseTimer();
    });

    rules.addEventListener('click', () => {
        if (document.querySelector('.openedResults')){
            return;
        }
        document.body.insertAdjacentHTML(
            `afterbegin`,
        `<div class="modal__window openedRules">
            <h2 class="modal__text">The goal of sudoku is simple: fill in the numbers 1-9 exactly once in every row, column, and 3x3 region.</h2>
            <div class="modal__window_img">
                <img src="./assets/img/sudoku-rules.png" alt="wasted" class="img">
            </div>
            <button class="modal__button">Understood</button>
        </div>`);
        document.querySelector('.modal__button').addEventListener('click', () => {
            document.querySelector('.modal__window').remove();
        })
    });

    results.addEventListener('click', () => {
        if (document.querySelector('.openedRules')){
            return;
        }
        openResults();
    });

    digitButtons.forEach(digitButton => digitButton.addEventListener('click', () => {
        if (document.querySelectorAll('.game__field_miniGrid_cell[checked="checked"]').length > 1) {
            return; // todo
        }

        const digit = digitButton.innerHTML;
        const checkedCell = document.querySelector('.game__field_miniGrid_cell[checked="checked"]');
        checkedCell.innerHTML = digit;
        checkedCell.style.color = '#3187A2';
        checkNineCaseofDigit();
        highlightDigits(checkedCell);
        checkMistakes(checkedCell);

        if (document.querySelectorAll('.game__field_miniGrid_cell[checked="checked"]').length === 8) {
            digitButton.classList.add('hide');
        }

        finishGame();
    }));

    //for finish
    function finishGame() {
        if (isAllCellsPopulated()) {
            document.querySelector('.audio-complete').play();
            const lastGame = saveGameResult(sec, mistakesNumber.innerHTML);
            openResults(lastGame);
            Array.from(document.querySelectorAll('.game__controlls_top_button')).forEach(button => button.setAttribute('disabled', 'disabled'));
        }
    }

    function isAllCellsPopulated() {
        return queryCells().filter(cell => cell.innerHTML !== '').length === 81;
    }

    //for start game
    const startGame = async () => {
        mistakesNumber.classList.remove('error');
        document.querySelector('.main').style.display = 'none';
        document.querySelector('.reserve').style.display = 'grid';
        Array.from(document.querySelectorAll('.game__controlls_top_button')).forEach(button => button.removeAttribute('disabled', 'disabled'));

        if (document.querySelector('.modal__window')){
            document.querySelector('.modal__window').style.display = 'none';
        }
        playTimer();
        document.querySelector('.audio-start').play();

        startTimer();

        for (let miniGrid of Array.from(wraper.children)){
            miniGrid.remove();
        }
        mistakesNumber.innerHTML = '0';
        Array.from(document.querySelectorAll('.game__controlls_numbers_num')).map(button => button.classList.remove('hide'));
        const field = getNextGameField();

        const fieldHtml = field.map((item, index) => {
            return `<div class="game__field_miniGrid ${index + 1}">
            <div class="game__field_miniGrid_cell 1">${item[0]}</div>
            <div class="game__field_miniGrid_cell 2">${item[1]}</div>
            <div class="game__field_miniGrid_cell 3">${item[2]}</div>
            <div class="game__field_miniGrid_cell 4">${item[3]}</div>
            <div class="game__field_miniGrid_cell 5">${item[4]}</div>
            <div class="game__field_miniGrid_cell 6">${item[5]}</div>
            <div class="game__field_miniGrid_cell 7">${item[6]}</div>
            <div class="game__field_miniGrid_cell 8">${item[7]}</div>
            <div class="game__field_miniGrid_cell 9">${item[8]}</div>
        </div>`
        }).join('');
        document.querySelector('.game__field').insertAdjacentHTML('afterbegin', fieldHtml);

        queryCells().filter(item => item.innerHTML == 0).forEach(item => item.innerHTML = '');
        queryCells().map(cell => cell.addEventListener('click', () => chooseCell(cell)));
    };

    newGameButton.addEventListener('click', startGame);
})();
