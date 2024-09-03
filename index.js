document.addEventListener('DOMContentLoaded', function() {
    var addButton = document.getElementById('addButton');
    var noteInput = document.getElementById('noteInput');
    var saveButton = document.getElementById('saveButton');
    var searchInput = document.getElementById('searchInput');
    var completedCount = document.getElementById('completedCount');

    addButton.addEventListener('click', function(){
        addButton.style.display = 'none';
        noteInput.style.display = 'block';
        saveButton.style.display = 'block';
        noteInput.focus();
    });


    saveButton.addEventListener('click', function () {
        addOrUpdateNote();
    });


    loadNotes();


    searchInput.addEventListener('input', function(){
        var searchValue = searchInput.value.trim().toLowerCase();
        var notes = JSON.parse(localStorage.getItem('notes')) || [];

        var filteredNotes = notes.filter(function(note){
            return note.text.toLowerCase().includes(searchValue);
        });
        renderNotes(filteredNotes);
    });


});


function loadNotes() {
    var notes =  JSON.parse(localStorage.getItem('notes')) || [];
    renderNotes(notes);
}


function renderNotes(notes){
    var notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = '';

    var completedTask = 0;

    notes.forEach(function(note, index){
        var noteElement = createNoteElement(note, index);
        notesContainer.appendChild(noteElement);
        if(note.completed){
            completedTask++;
        }
    });

    updateCompletedCount(completedTask, notes.length);
}





function createNoteElement(note, index){
    var noteElement = document.createElement('div');
    noteElement.className = 'col-lg-4 col-md-6 col-sm-12 note';


    var checkboxWrapper = document.createElement('div');
    checkboxWrapper.classList.add('checkbox-wrapper');

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'cb-' + index;
    checkbox.checked = note.completed;
    checkbox.classList.add('custom-checkbox');

    checkbox.addEventListener('change', function(){
        toggledCompleted(index);
    });

    var label = document.createElement('label');
    label.classList.add('check-box');
    label.setAttribute('for', 'cb-' + index);



    checkboxWrapper.appendChild(checkbox);
    checkboxWrapper.appendChild(label);


    var textNode = document.createTextNode(note.text);


    noteElement.appendChild(checkboxWrapper);
    noteElement.appendChild(textNode);


    var editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', function(){
        editNote(index);
    });
    noteElement.appendChild(editButton);

    var deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', function(){
        deleteNoteElement(index);
    });
    noteElement.appendChild(deleteButton);


    return noteElement;
}



function updateCompletedCount(completedTask, total){
    var completedCount = document.getElementById('completedCount');
    completedCount.textContent = `Has completado ${completedTask} de ${total} tareas`;
}






function addOrUpdateNote() {
    console.log('guardando nota...');

    var noteInputValue = document.getElementById('noteInput').value.trim();
    if(noteInputValue !== ''){
        var notes = JSON.parse(localStorage.getItem('notes')) || [];
        var noteIndexElement  =  document.getElementById('noteIndex');

        var noteIndex = noteIndexElement ? parseInt(noteIndexElement.value) : -1;
        if(!isNaN(noteIndex) && noteIndex >= 0 && noteIndex < notes.length){
            notes[noteIndex].text = noteInputValue;
        }else{
            notes.push({text: noteInputValue, completed: false});
        }

        localStorage.setItem('notes', JSON.stringify(notes));

        loadNotes();

        document.getElementById('noteInput').value = '';
        document.getElementById('addButton').style.display = 'block';
        document.getElementById('noteInput').style.display = 'none';
        document.getElementById('saveButton').style.display = 'none';

        if(noteIndexElement){
            noteIndexElement.value = '';
        }
    }else{
        alert('La nota no puede estar vacía');
    }

    
}


function editNote(index){
    var notes = JSON.parse(localStorage.getItem('notes')) || [];
    if(index >= 0 && index < notes.length){

        document.getElementById('noteInput').value = notes[index].text;
        document.getElementById('noteIndex').value = index;
        document.getElementById('addButton').style.display = 'none';
        document.getElementById('noteInput').style.display = 'block';
        document.getElementById('saveButton').style.display = 'block';

    }
}


function  deleteNoteElement(index){
    var notes = JSON.parse(localStorage.getItem('notes')) || [];
    if(index >= 0 && index < notes.length){
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
    }
}


function toggledCompleted(index){
    var notes = JSON.parse(localStorage.getItem('notes')) || [];
    if(index >= 0 && index < notes.length){
        notes[index].completed = !notes[index].completed;
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
    }
}