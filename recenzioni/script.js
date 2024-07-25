document.getElementById('recensionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const recensionInput = document.getElementById('recensionInput');
    const recensionText = recensionInput.value.trim();

    if (recensionText) {
        addRecension(recensionText);
        recensionInput.value = '';
    }
});

function addRecension(text) {
    addRecensionToList(text);
    saveRecension(text);
}

function addRecensionToList(text) {
    const recensionList = document.getElementById('recensionUl');
    const li = document.createElement('li');
    li.textContent = text;
    li.classList.add('li');
    recensionList.appendChild(li);
}

function saveRecension(text) {
    let recensioni = localStorage.getItem('recensioni');
    if (!recensioni) {
        recensioni = [];
    } else {
        recensioni = JSON.parse(recensioni);
    }
    recensioni.push(text);
    localStorage.setItem('recensioni', JSON.stringify(recensioni));
}

function loadRecensioni() {
    let recensioni = localStorage.getItem('recensioni');
    if (recensioni) {
        recensioni = JSON.parse(recensioni);
        recensioni.forEach(recension => addRecensionToList(recension));
    }
}

window.onload = loadRecensioni;
