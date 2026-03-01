let cards = [];

// Which card is currently targeted for a new todo
let activeTodoCardId = null;

const board = document.getElementById("board");
const boardEmpty = document.getElementById("board-empty");
const toast = document.getElementById("toast");

// Card modal
const modalCard = document.getElementById("modal-card");
const cardTitleInput = document.getElementById("card-title-input");
const btnAddCard = document.getElementById("btn-add-card");
const btnAddCardEmpty = document.getElementById("btn-add-card-empty");
const modalCardClose = document.getElementById("modal-card-close");
const modalCardCancel = document.getElementById("modal-card-cancel");
const modalCardConfirm = document.getElementById("modal-card-confirm");

// Todo modal
const modalTodo = document.getElementById("modal-todo");
const todoTextInput = document.getElementById("todo-text-input");
const modalTodoClose = document.getElementById("modal-todo-close");
const modalTodoCancel = document.getElementById("modal-todo-cancel");
const modalTodoConfirm = document.getElementById("modal-todo-confirm");

// Share
const btnShare = document.getElementById("btn-share");

// Helpers
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function openModal(modal, input) {
  modal.classList.add("open");
  if (input) setTimeout(() => input.focus(), 80);
}

function closeModal(modal, input) {
  modal.classList.remove("open");
  if (input) input.value = "";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function render() {
  // Remove existing card elements (keep the empty state node)
  document.querySelectorAll(".card").forEach((el) => el.remove());

  // Toggle empty state
  boardEmpty.style.display = cards.length === 0 ? "flex" : "none";

  // Render each card
  cards.forEach((card) => {
    board.appendChild(buildCardEl(card));
  });

  // Persist to URL
  saveToHash();
}

function buildCardEl(card) {
  const doneCount = card.todos.filter((t) => t.done).length;
  const totalCount = card.todos.length;
  const progress =
    totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const el = document.createElement("article");
  el.className = "card";
  el.dataset.cardId = card.id;

  el.innerHTML = `
    <div class="card-header">
      <h3 class="card-title">${escapeHtml(card.title)}</h3>
      <div class="card-meta">
        <span class="card-count ${totalCount > 0 ? "has-items" : ""}">
          ${doneCount}/${totalCount}
        </span>
        <button class="btn-card-delete" data-card-id="${card.id}" title="Delete card" aria-label="Delete card">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </div>
    </div>

    <ul class="card-todos">
      ${card.todos.map((todo) => buildTodoHtml(todo)).join("")}
    </ul>

    <div class="card-footer">
      <div class="card-progress">
        <div class="card-progress-bar-track">
          <div class="card-progress-bar" style="width: ${progress}%"></div>
        </div>
        <span class="card-progress-text">${progress}% complete</span>
      </div>
      <button class="btn-add-todo" data-card-id="${card.id}">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add todo
      </button>
    </div>
  `;

  // Wire up events within this card
  el.querySelector(".btn-card-delete").addEventListener("click", () => {
    deleteCard(card.id);
  });

  el.querySelector(".btn-add-todo").addEventListener("click", () => {
    activeTodoCardId = card.id;
    openModal(modalTodo, todoTextInput);
  });

  el.querySelectorAll(".todo-checkbox").forEach((cb) => {
    cb.addEventListener("change", () => {
      toggleTodo(card.id, cb.dataset.todoId, cb.checked);
    });
  });

  el.querySelectorAll(".btn-todo-delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteTodo(card.id, btn.dataset.todoId);
    });
  });

  return el;
}

function buildTodoHtml(todo) {
  return `
    <li class="todo-item ${todo.done ? "done" : ""}">
      <input
        class="todo-checkbox"
        type="checkbox"
        id="todo-${todo.id}"
        data-todo-id="${todo.id}"
        ${todo.done ? "checked" : ""}
        aria-label="${escapeHtml(todo.text)}"
      />
      <label class="todo-label" for="todo-${todo.id}">${escapeHtml(todo.text)}</label>
      <button class="btn-todo-delete" data-todo-id="${todo.id}" title="Remove todo" aria-label="Remove todo">✕</button>
    </li>
  `;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── Actions ──────────────────────────────────────────
function addCard(title) {
  const trimmed = title.trim();
  if (!trimmed) return;
  cards.push({ id: uid(), title: trimmed, todos: [] });
  render();
}

function deleteCard(cardId) {
  cards = cards.filter((c) => c.id !== cardId);
  render();
}

function addTodo(cardId, text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  const card = cards.find((c) => c.id === cardId);
  if (!card) return;
  card.todos.push({ id: uid(), text: trimmed, done: false });
  render();
}

function toggleTodo(cardId, todoId, done) {
  const card = cards.find((c) => c.id === cardId);
  if (!card) return;
  const todo = card.todos.find((t) => t.id === todoId);
  if (!todo) return;
  todo.done = done;
  // Update progress bar without full re-render for smoothness
  const doneCount = card.todos.filter((t) => t.done).length;
  const totalCount = card.todos.length;
  const progress =
    totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const cardEl = document.querySelector(`.card[data-card-id="${cardId}"]`);
  if (cardEl) {
    cardEl.querySelector(".card-progress-bar").style.width = progress + "%";
    cardEl.querySelector(".card-progress-text").textContent =
      progress + "% complete";
    cardEl.querySelector(".card-count").textContent =
      `${doneCount}/${totalCount}`;
    const li = cardEl.querySelector(`li:has([data-todo-id="${todoId}"])`);
    if (li) li.classList.toggle("done", done);
  }
  saveToHash();
}

function deleteTodo(cardId, todoId) {
  const card = cards.find((c) => c.id === cardId);
  if (!card) return;
  card.todos = card.todos.filter((t) => t.id !== todoId);
  render();
}

// ─── Persistence: URL Hash ────────────────────────────
function saveToHash() {
  try {
    const encoded = btoa(encodeURIComponent(JSON.stringify(cards)));
    history.replaceState(null, "", "#" + encoded);
  } catch (e) {
    console.warn("Could not save to hash:", e);
  }
}

function loadFromHash() {
  const hash = location.hash.slice(1);
  if (!hash) return;
  try {
    const decoded = JSON.parse(decodeURIComponent(atob(hash)));
    if (Array.isArray(decoded)) {
      cards = decoded;
    }
  } catch (e) {
    console.warn("Could not load from hash:", e);
  }
}

function shareBoard() {
  saveToHash();
  const url = location.href;
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        showToast("Board link copied to clipboard ✓");
      })
      .catch(() => {
        fallbackCopy(url);
      });
  } else {
    fallbackCopy(url);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  showToast("Board link copied ✓");
}

// Open card modal
btnAddCard.addEventListener("click", () =>
  openModal(modalCard, cardTitleInput),
);
btnAddCardEmpty.addEventListener("click", () =>
  openModal(modalCard, cardTitleInput),
);

// Close card modal
modalCardClose.addEventListener("click", () =>
  closeModal(modalCard, cardTitleInput),
);
modalCardCancel.addEventListener("click", () =>
  closeModal(modalCard, cardTitleInput),
);
modalCard.addEventListener("click", (e) => {
  if (e.target === modalCard) closeModal(modalCard, cardTitleInput);
});

// Confirm card creation
modalCardConfirm.addEventListener("click", () => {
  const val = cardTitleInput.value.trim();
  if (!val) {
    cardTitleInput.focus();
    return;
  }
  addCard(val);
  closeModal(modalCard, cardTitleInput);
});
cardTitleInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") modalCardConfirm.click();
  if (e.key === "Escape") closeModal(modalCard, cardTitleInput);
});

// Close todo modal
modalTodoClose.addEventListener("click", () =>
  closeModal(modalTodo, todoTextInput),
);
modalTodoCancel.addEventListener("click", () =>
  closeModal(modalTodo, todoTextInput),
);
modalTodo.addEventListener("click", (e) => {
  if (e.target === modalTodo) closeModal(modalTodo, todoTextInput);
});

// Confirm todo creation
modalTodoConfirm.addEventListener("click", () => {
  const val = todoTextInput.value.trim();
  if (!val) {
    todoTextInput.focus();
    return;
  }
  addTodo(activeTodoCardId, val);
  closeModal(modalTodo, todoTextInput);
});
todoTextInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") modalTodoConfirm.click();
  if (e.key === "Escape") closeModal(modalTodo, todoTextInput);
});

// Share
btnShare.addEventListener("click", shareBoard);

// Global Escape key to close any open modal
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (modalCard.classList.contains("open"))
    closeModal(modalCard, cardTitleInput);
  if (modalTodo.classList.contains("open"))
    closeModal(modalTodo, todoTextInput);
});

// Initial load
loadFromHash();
render();