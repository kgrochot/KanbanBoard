const cards = document.querySelectorAll('.card');
const lists = document.querySelectorAll('.list');
const addBtns = document.querySelectorAll('.add-btn');
const inputs = document.querySelectorAll('.input');
const newCard = document.createElement('div');

let cardIdCounter = 100;

// ================= DRAG & DROP =================
cards.forEach(card => {
    addDragEvents(card);
});

lists.forEach(list => {
    list.addEventListener('dragover', e => e.preventDefault());
    list.addEventListener('dragenter', function () {
        this.classList.add('over');
    });
    list.addEventListener('dragleave', function () {
        this.classList.remove('over');
    });
    list.addEventListener('drop', function (e) {
        const cardId = e.dataTransfer.getData('text/plain');
        const card = document.getElementById(cardId);
        this.appendChild(card);
        this.classList.remove('over');
        saveBoard();
    });
});

function addDragEvents(card) {
    card.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', e.target.id);
        setTimeout(() => card.classList.add('hide'), 0);
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('hide');
    });
}

// ================= ADD CARD =================
addBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        const text = inputs[index].value.trim();
        if (!text) return;

        const newCard = document.createElement('div');
        newCard.classList.add('card');
        newCard.setAttribute('draggable', 'true');
        newCard.id = 'card' + cardIdCounter++;

        // Text
        const textSpan = document.createElement('span');
        textSpan.textContent = text;

        // Edit
        textSpan.addEventListener('dblclick', () => {
            const newText = prompt("Bearbeite:", textSpan.textContent);
            if (newText && newText.trim() !== "") {
                textSpan.textContent = newText;
                saveBoard();
            }
        });

        // Delete
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "✖";
        deleteBtn.classList.add('delete-btn');

        deleteBtn.addEventListener('click', () => {
            newCard.remove();
            saveBoard();
        });

        newCard.appendChild(textSpan);
        newCard.appendChild(deleteBtn);

        addDragEvents(newCard);
        lists[index].appendChild(newCard);

        inputs[index].value = '';

        saveBoard();
    });
});

// ================= SAVE =================
function saveBoard() {
    const data = [];

    lists.forEach(list => {
        const cards = list.querySelectorAll('.card');
        const listData = [];

        cards.forEach(card => {
            listData.push({
                id: card.id,
                text: card.textContent
            });
        });

        data.push(listData);
    });

    localStorage.setItem('kanbanData', JSON.stringify(data));
}

// ================= LOAD =================
function loadBoard() {
    const data = JSON.parse(localStorage.getItem('kanbanData'));
    if (!data) return;

    lists.forEach((list, index) => {
        list.querySelectorAll('.card').forEach(card => card.remove());

        data[index].forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('draggable', 'true');
            card.id = item.id;

            const textSpan = document.createElement('span');
            textSpan.textContent = item.text;

            // Edit
            textSpan.addEventListener('dblclick', () => {
                const newText = prompt("Bearbeite:", textSpan.textContent);
                if (newText && newText.trim() !== "") {
                    textSpan.textContent = newText;
                    saveBoard();
                }
            });

            // Delete
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = "✖";

            deleteBtn.addEventListener('click', () => {
                card.remove();
                saveBoard();
            });

            card.appendChild(textSpan);
            card.appendChild(deleteBtn);

            addDragEvents(card);
            list.appendChild(card);
        });
    });
}

loadBoard();