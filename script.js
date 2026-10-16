'use strict';
const STORAGE_KEY = 'quick-notes';
const MAX_LENGTH = 200;

const noteForm = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const noteCategory = document.querySelector('#note-category');
const searchInput = document.querySelector('#search-input');
const notesList = document.querySelector('#notes-list');
const noteCount = document.querySelector('#note-count');
const errorMessage = document.querySelector('#error-message');

let notes = loadNotes();
let editingId = null;

function saveNotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    showError('Could not save your notes. Browser storage may be full or disabled.');
  }
}

function loadNotes() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        typeof item.text === 'string' &&
        typeof item.category === 'string' &&
        typeof item.createdAt === 'string'
    );
  } catch (error) {
    return [];
  }
}

function generateId() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

function showError(message) {
  errorMessage.textContent = message;
}

function clearError() {
  errorMessage.textContent = '';
}

function validateText(text) {
  if (text.length === 0) {
    return 'Please write something before saving your note.';
  }
  if (text.length > MAX_LENGTH) {
    return `Notes can be at most ${MAX_LENGTH} characters. Yours is ${text.length}.`;
  }
  return '';
}

function getVisibleNotes() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return notes;

  return notes.filter(
    (note) =>
      note.text.toLowerCase().includes(query) ||
      note.category.toLowerCase().includes(query)
  );
}

function updateCount(visibleCount) {
  const isSearching = searchInput.value.trim() !== '';

  if (isSearching) {
    if (visibleCount === 0) {
      noteCount.textContent = 'No notes match your search';
    } else if (visibleCount === 1) {
      noteCount.textContent = '1 note found';
    } else {
      noteCount.textContent = `${visibleCount} notes found`;
    }
    return;
  }

  if (visibleCount === 0) {
    noteCount.textContent = 'No notes yet';
  } else if (visibleCount === 1) {
    noteCount.textContent = '1 note';
  } else {
    noteCount.textContent = `${visibleCount} notes`;
  }
}

function addNote(text, category) {
  const note = {
    id: generateId(),
    text: text,
    category: category,
    createdAt: new Date().toISOString(),
  };
  notes.unshift(note);
  saveNotes();
  render();
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  if (editingId === id) editingId = null;
  clearError();
  saveNotes();
  render();
}

function startEdit(id) {
  editingId = id;
  clearError();
  render();

  const editField = notesList.querySelector('.note-edit-input');
  if (editField) {
    editField.focus();
    editField.setSelectionRange(editField.value.length, editField.value.length);
  }
}

function cancelEdit() {
  editingId = null;
  clearError();
  render();
}

function saveEdit(id, newText) {
  const text = newText.trim();
  const error = validateText(text);
  if (error) {
    showError(error);
    return;
  }

  const note = notes.find((item) => item.id === id);
  if (note) note.text = text;

  editingId = null;
  clearError();
  saveNotes();
  render();
}

// direction: -1 = up, 1 = down (relative to what is currently visible)
function moveNote(id, direction) {
  const visible = getVisibleNotes();
  const visibleIndex = visible.findIndex((note) => note.id === id);
  const neighbour = visible[visibleIndex + direction];
  if (!neighbour) return;

  const fromIndex = notes.findIndex((note) => note.id === id);
  const toIndex = notes.findIndex((note) => note.id === neighbour.id);
  [notes[fromIndex], notes[toIndex]] = [notes[toIndex], notes[fromIndex]];

  saveNotes();
  render();
}

function createButton(label, className, ariaLabel) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `btn ${className}`;
  button.textContent = label;
  if (ariaLabel) button.setAttribute('aria-label', ariaLabel);
  return button;
}

function createNoteItem(note, index, total) {
  const item = document.createElement('li');
  item.className = 'note-item';
  item.dataset.id = note.id;

  const category = document.createElement('span');
  category.className = 'note-category';
  category.textContent = note.category;

  const actions = document.createElement('div');
  actions.className = 'note-actions';

  /* ----- Edit mode ----- */
  if (note.id === editingId) {
    const editField = document.createElement('textarea');
    editField.className = 'note-edit-input';
    editField.value = note.text;
    editField.rows = 4;
    editField.setAttribute('aria-label', 'Edit note text');

    editField.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        cancelEdit();
      } else if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        saveEdit(note.id, editField.value);
      }
    });

    const saveBtn = createButton('Save', 'save-btn');
    saveBtn.addEventListener('click', () => saveEdit(note.id, editField.value));

    const cancelBtn = createButton('Cancel', 'cancel-btn');
    cancelBtn.addEventListener('click', cancelEdit);

    actions.append(saveBtn, cancelBtn);
    item.append(editField, category, actions);
    return item;
  }

  const text = document.createElement('span');
  text.className = 'note-text';
  text.textContent = note.text;

  const upBtn = createButton('\u2191', 'move-up', 'Move note up');
  upBtn.disabled = index === 0;
  upBtn.addEventListener('click', () => moveNote(note.id, -1));

  const downBtn = createButton('\u2193', 'move-down', 'Move note down');
  downBtn.disabled = index === total - 1;
  downBtn.addEventListener('click', () => moveNote(note.id, 1));

  const editBtn = createButton('Edit', 'edit-btn');
  editBtn.addEventListener('click', () => startEdit(note.id));

  const deleteBtn = createButton('Delete', 'delete-btn');
  deleteBtn.addEventListener('click', () => deleteNote(note.id));

  actions.append(upBtn, downBtn, editBtn, deleteBtn);
  item.append(text, category, actions);
  return item;
}

function render() {
  const visible = getVisibleNotes();

  notesList.replaceChildren();
  visible.forEach((note, index) => {
    notesList.appendChild(createNoteItem(note, index, visible.length));
  });

  updateCount(visible.length);
}

noteForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = noteInput.value.trim();
  const error = validateText(text);
  if (error) {
    showError(error);
    noteInput.focus();
    return;
  }

  clearError();
  addNote(text, noteCategory.value);

  noteInput.value = '';
  searchInput.value = '';
  render();
  noteInput.focus();
});

noteInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    noteForm.requestSubmit();
  }
});

noteInput.addEventListener('input', clearError);

searchInput.addEventListener('input', render);

render();
