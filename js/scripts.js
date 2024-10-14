// Add To Prototype Chain And Extend Constructors

String.prototype.capitalize = function () {

    return this.trim().split(" ").map(term => {

        return term[0].toUpperCase() + term.slice(1);

    }).join(" ");

}

// Base Task class (Encapsulation & Abstraction)

class Task {

    #id;

    #title;

    #completed;

    constructor (id, title) {

        this.#id = id;

        this.#title = title;

        this.#completed = false;

    }

    // Getter for ID (Encapsulation)
    
    getId() {

        return this.#id;

    }

    // Getter and Setter for Title (Encapsulation)

    getTitle() {

        return this.#title;

    }

    setTitle(title) {

        this.#title = title

    }

    // Toggle completion status (Abstraction)

    toggleComplete() {

        this.#completed = !this.#completed;

    }

    // Get the completion status (Encapsulation)

    isCompleted() {

        return this.#completed;

    }

    // Convert task data to an object for storage

    toObj() {

        return {

            id: this.#id,

            title: this.#title,

            completed: this.#completed

        }

    }

    // Restore a Task object from plain object data (Polymorphism)

    static fromObject(obj) {

        const task = new Task(obj.id, obj.title);

        if (obj.completed) task.toggleComplete();

        return task;

    }

}

// Inherited class for special tasks (Inheritance & Polymorphism)

class ImportantTask extends Task {

    constructor (id, title, priority) {

        super(id, title);

        this.priority = priority;

    }

    // Override the toObject method (Polymorphism)

    toObj() {

        const obj = super.toObj();

        obj.priority = this.priority;

        return obj;

    }

    // Override the static method to include priority (Polymorphism)

    static fromObject(obj) {

        const task = new ImportantTask(obj.id, obj.title, obj.priority);

        if (obj.completed) task.toggleComplete();

        return task;

    }

}

// Class to manage the list of tasks (Encapsulation & Abstraction)

class TodoList {

    #tasks;

    constructor () {

        this.#tasks = this.#loadFromLocalStorage();

    }

    // Add a new task (Abstraction)

    addTask(title) {

        const id = Date.now();

        const newTask = new Task(id, title);

        this.#tasks.push(newTask);

        this.#saveToLocalStorage();

        return newTask;

    }

    // Add an important task (Abstraction)

    addImportantTask(title, priority) {

        const id = Date.now();

        const newImportantTask = new ImportantTask(id, title, priority);

        this.#tasks.push(newTask);

        this.#saveToLocalStorage();

        return newImportantTask;

    }

    // Remove a task by ID (Abstraction)

    removeTask(id) {

        this.#tasks = this.#tasks.filter(task => task.getId() !== id);

        this.#saveToLocalStorage();

    }

    // Toggle a task's completion status (Abstraction)

    toggleTaskCompletion(id) {

        const task = this.#tasks.find(task => task.getId() === id);

        if (task) {

            task.toggleComplete();

            this.#saveToLocalStorage();

        }

    }

    // Get all tasks (Encapsulation)

    getTasks() {

        return this.#tasks;

    }

    // Save tasks to LocalStorage (Encapsulation)

    #saveToLocalStorage() {

        const taskData = this.#tasks.map(task => task.toObj());

        localStorage.setItem("tasks", JSON.stringify(taskData));

    }

    // Load tasks from LocalStorage (Encapsulation)

    #loadFromLocalStorage() {

        const taskData = JSON.parse(localStorage.getItem("tasks")) || [];

        return taskData.map(obj => {

            return obj.priority ? 
            
            ImportantTask.fromObject(obj) :

            Task.fromObject(obj)

        });

    }

}

// Instantiate the TodoList

const todoList = new TodoList();

// Add event listeners to handle UI interactions

document.querySelector('.todo-app--submit-btn').addEventListener("click", (e) => {

    e.preventDefault();

    const taskTitle = document.getElementById("todo-app--input").value;

    if (taskTitle) {

        const newTask = todoList.addTask(taskTitle.capitalize());

        renderTask(newTask);

        document.getElementById("todo-app--input").value = "";

    }

});

const todoAppTasksEl = document.querySelector('.todo-app--tasks');

function renderTask(task) {

    if (todoAppTasksEl.children.length > 0) {

        if (todoAppTasksEl.firstChild.classList.contains("empty")) {

            todoAppTasksEl.firstChild.remove();

        }

    }

    const todoAppTaskEl = document.createElement('li');

    todoAppTaskEl.setAttribute('data-id', task.getId());

    todoAppTaskEl.className = "todo-app--task";

    const todoAppTaskTitleEl = document.createElement("span");

    todoAppTaskTitleEl.className = "todo-app--task-title";

    todoAppTaskTitleEl.textContent = task.getTitle();

    todoAppTaskEl.appendChild(todoAppTaskTitleEl);

    if (task.isCompleted()) {

        todoAppTaskEl.classList.add('completed');
        
    }

    const todoAppTaskActionsEl = document.createElement("div");

    todoAppTaskActionsEl.className = "todo-app--task-actions";

    const MarkBtnEl = document.createElement('button');

    MarkBtnEl.className = "btn";

    MarkBtnEl.textContent = task.isCompleted() ? 'Unmark' : 'Mark as Complete';

    todoAppTaskActionsEl.appendChild(MarkBtnEl);

    MarkBtnEl.addEventListener('click', () => {

        todoList.toggleTaskCompletion(task.getId());

        todoAppTaskEl.classList.toggle('completed');

        MarkBtnEl.textContent = task.isCompleted() ? 'Unmark' : 'Mark as Complete';

    });

    const deleteBtnEl = document.createElement('button');

    deleteBtnEl.className = "btn";

    deleteBtnEl.textContent = 'Delete';

    todoAppTaskActionsEl.appendChild(deleteBtnEl);

    deleteBtnEl.addEventListener('click', () => {
        
        todoList.removeTask(task.getId());

        todoAppTasksEl.removeChild(todoAppTaskEl);

        isEmpty();

    });

    todoAppTaskEl.appendChild(todoAppTaskActionsEl);

    todoAppTasksEl.appendChild(todoAppTaskEl);

}

function isEmpty() {

    if (todoAppTasksEl.children.length <= 0) {

        const emptyEl = document.createElement("p");

        emptyEl.className = "empty";

        emptyEl.textContent = "No Tasks To Show!";

        todoAppTasksEl.appendChild(emptyEl);

    }

}

// Initial render of tasks from local storage

if (todoList.getTasks().length > 0) {

    todoList.getTasks().forEach((task) => {

        renderTask(task);

    });

} else {

    isEmpty();

}
