const notesHeader = document.querySelector("header h1");
const searchInput = document.getElementById("searchbar");
const searchIcon = document.getElementById("search-icon");
const notesContainer = document.getElementById("notesContainer");
const titleInput = document.getElementById("title");
const contentTextarea = document.getElementById("notetextarea");
const boldButton = document.getElementById("bold");
const italicButton = document.getElementById("italic");
const underlineButton = document.getElementById("underline");
const strikeButton = document.getElementById("strike");
const saveNoteButton = document.getElementById("saveNote");
const deleteNoteButton = document.getElementById("deleteNote");
const infoHeader = document.getElementById("info");
const fileNameSpan = document.getElementById("fileName");
const wordCountSpan = document.getElementById("wordCount");
const lastEditedSpan = document.getElementById("lastEdited");

searchInput.addEventListener("focus", handleFocus);
searchInput.addEventListener("input", filterNotes);
searchInput.addEventListener("blur", handleBlur);
searchIcon.addEventListener("click", handleIconClick);
boldButton.addEventListener("click", makeBold);
italicButton.addEventListener("click", makeItalic);
underlineButton.addEventListener("click", makeUnderline);
strikeButton.addEventListener("click", makeStrike);
saveNoteButton.addEventListener("click", saveNote);
deleteNoteButton.addEventListener("click", deleteNote);

let notes = [];
let note = "";

function handleIconClick() {
  searchInput.value = "";
}

function handleFocus() {}

function handleBlur() {
  if (searchInput.value === "") {
    searchIcon.style.display = "inline-block";
  }
}

function saveNote() {
  let title = titleInput.value;
  let content = contentTextarea.value;
  let currentTime = new Date().toLocaleString();

  let existingNoteIndex = notes.findIndex((note) => note.title === title);

  if (existingNoteIndex !== -1) {
    notes[existingNoteIndex].content = content;
    notes[existingNoteIndex].lastEdited = currentTime;
    localStorage.setItem(title, JSON.stringify(notes[existingNoteIndex]));
  } else {
    let newNote = {
      title: title,
      content: content,
      lastEdited: currentTime,
    };

    localStorage.setItem(title, JSON.stringify(newNote));
    notes.push(newNote);
  }

  displayNotes();
}

function deleteNote() {
  let titleToDelete = titleInput.value;

  localStorage.removeItem(titleToDelete);

  notes = notes.filter((note) => note.title !== titleToDelete);

  displayNotes();
}

function filterNotes() {
  let searchTerm = searchInput.value.trim().toLowerCase();
  let filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm)
  );
  displayNotes(filteredNotes);
}

function displayNotes(filteredNotes = notes) {
  notesContainer.innerHTML = "";

  if (filteredNotes.length > 0) {
    let firstNote = filteredNotes[0];
    titleInput.value = firstNote.title;
    contentTextarea.value = firstNote.content;
    lastEditedSpan.textContent = firstNote.lastEdited;
    fileNameSpan.textContent = firstNote.title;
  }
  filteredNotes.forEach((note) => {
    let noteDiv = document.createElement("div");
    noteDiv.classList.add("note");
    noteDiv.innerHTML = '<div class="title">' + note.title + "</div>";
    let contentPreview = note.content
      ? note.content.length > 50
        ? note.content.substring(0, 50) + "..."
        : note.content
      : "";
    noteDiv.innerHTML +=
      '<div class="content-preview">' + contentPreview + "</div>";
    noteDiv.addEventListener("click", () => {
      titleInput.value = note.title;
      contentTextarea.value = note.content;
      lastEditedSpan.textContent = note.lastEdited;
      fileNameSpan.textContent = note.title;
    });
    notesContainer.appendChild(noteDiv);
  });
}

function updateLastEdited() {
  lastEditedSpan.textContent = new Date().toLocaleString();
}

function loadNotesFromLocalStorage() {
  notes = [];
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let noteJSON = localStorage.getItem(key);
    if (noteJSON) {
      note = JSON.parse(noteJSON);
      if (note.title && note.content && note.lastEdited) {
        let existingNoteIndex = notes.findIndex((n) => n.title === note.title);
        if (existingNoteIndex === -1) {
          notes.push(note);
        } else {
        }
      } else {
        console.error("Invalid note data found in local storage:", note);
      }
    }
  }
  displayNotes(notes);
}

loadNotesFromLocalStorage();
