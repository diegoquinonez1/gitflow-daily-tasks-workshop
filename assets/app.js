// app.js

// --- Modelo y lógica de negocio ---

/**
 * Crea una nueva tarea.
 * @param {Array} list Lista actual de tareas.
 * @param {string} text Texto de la nueva tarea.
 * @returns {Array} Nueva lista con la tarea añadida.
 */
export function addTask(list, text) {
  const trimmed = String(text).trim();
  if (!trimmed) {
    throw new Error("La tarea no puede estar vacía");
  }

  const newTask = {
    id: crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now() + Math.random()),
    text: trimmed,
    completed: false,
  };

  return [...list, newTask];
}

/**
 * Alterna el estado de completado de una tarea.
 * @param {Array} list
 * @param {string} id
 * @returns {Array} Nueva lista con la tarea actualizada.
 */
export function toggleTask(list, id) {
  return list.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task,
  );
}

// --- Renderizado / UI ---

function createTaskItemElement(task) {
  const li = document.createElement("li");
  li.className = "task-item";
  if (task.completed) {
    li.classList.add("completed");
  }
  li.dataset.taskId = task.id;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;

  const span = document.createElement("span");
  span.textContent = task.text;

  li.appendChild(checkbox);
  li.appendChild(span);

  return li;
}

function renderTaskList(container, tasks) {
  container.innerHTML = "";
  tasks.forEach((task) => {
    const li = createTaskItemElement(task);
    container.appendChild(li);
  });
}

// --- Estado y wiring de la app ---

/**
 * Inicializa la app de tareas sobre el DOM actual.
 * Encapsula el estado en memoria de la lista de tareas.
 */
export function setupTaskApp() {
  let tasks = [];

  const input = document.getElementById("task-input");
  const addBtn = document.getElementById("add-task-btn");
  const listEl = document.getElementById("task-list");

  if (!input || !addBtn || !listEl) {
    console.error("Elementos de la UI no encontrados");
    return;
  }

  const handleAddTask = () => {
    try {
      tasks = addTask(tasks, input.value);
      input.value = "";
      renderTaskList(listEl, tasks);
    } catch (e) {
      // Para mantener simple el ejemplo, solo mostramos en consola
      console.warn(e.message);
    }
  };

  addBtn.addEventListener("click", handleAddTask);

  listEl.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      const li = target.closest("li");
      if (!li) return;
      const id = li.dataset.taskId;
      tasks = toggleTask(tasks, id);
      renderTaskList(listEl, tasks);
    }
  });
}

// Inicialización en navegador real
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    setupTaskApp();
  });
}
