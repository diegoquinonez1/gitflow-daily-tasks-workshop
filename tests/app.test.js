import { addTask, toggleTask, setupTaskApp } from "../assets/app.js";

describe('addTask', () => {
  test('agrega una nueva tarea válida', () => {
    const initial = [];
    const result = addTask(initial, 'Comprar leche');

    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Comprar leche');
    expect(result[0].completed).toBe(false);
    expect(result[0].id).toBeDefined();
  });

  test('recorta espacios y sigue siendo válida', () => {
    const initial = [];
    const result = addTask(initial, '  Llamar al médico  ');
    expect(result[0].text).toBe('Llamar al médico');
  });

  test('lanza error si la tarea está vacía o solo con espacios', () => {
    expect(() => addTask([], '')).toThrow('La tarea no puede estar vacía');
    expect(() => addTask([], '   ')).toThrow('La tarea no puede estar vacía');
  });
});

describe('toggleTask', () => {
  test('alterna el estado completed de la tarea con el id dado', () => {
    const tasks = [
      { id: '1', text: 'Tarea 1', completed: false },
      { id: '2', text: 'Tarea 2', completed: true }
    ];

    const result = toggleTask(tasks, '1');
    const t1 = result.find(t => t.id === '1');
    const t2 = result.find(t => t.id === '2');

    expect(t1.completed).toBe(true);
    expect(t2.completed).toBe(true); // la segunda no cambia
  });
});

describe('setupTaskApp (DOM + JSDOM)', () => {
  beforeEach(() => {
    // Montamos un DOM mínimo
    document.body.innerHTML = `
      <section id="task-app">
        <div class="task-input-container">
          <input id="task-input" type="text" />
          <button id="add-task-btn">Agregar</button>
        </div>
        <ul id="task-list"></ul>
      </section>
    `;
    setupTaskApp();
  });

  test('agrega una tarea cuando se hace click en "Agregar"', () => {
    const input = document.getElementById('task-input');
    const button = document.getElementById('add-task-btn');
    const list = document.getElementById('task-list');

    input.value = 'Estudiar GitFlow';
    button.click();

    expect(list.children).toHaveLength(1);
    const firstItem = list.children[0];
    expect(firstItem.querySelector('span').textContent).toBe('Estudiar GitFlow');
  });

  test('marca una tarea como completada al hacer click en el checkbox', () => {
    const input = document.getElementById('task-input');
    const button = document.getElementById('add-task-btn');
    const list = document.getElementById('task-list');

    input.value = 'Hacer ejercicio';
    button.click();

    const firstItem = list.children[0];
    const checkbox = firstItem.querySelector('input[type="checkbox"]');

    expect(firstItem.classList.contains('completed')).toBe(false);

    checkbox.click();

    // Después del click, la lista se re-renderiza,
    // recuperamos de nuevo el primer elemento
    const updatedItem = list.children[0];
    expect(updatedItem.classList.contains('completed')).toBe(true);
  });
});