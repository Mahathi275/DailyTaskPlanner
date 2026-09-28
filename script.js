// Step 3 & 6: Data state models configurations arrays
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let currentEditId = null;

// Object DOM Workspace element component references
const currentDateEl = document.getElementById("current-date");
const taskInput = document.getElementById("taskInput");
const searchInput = document.getElementById("search");
const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");
const counterText = document.getElementById("count");
const filterControls = document.getElementById("filter-controls");
const modal = document.getElementById("modal");
const modalInput = document.getElementById("modalInput");

// Feature 1: Display the current date at the top of the application
// Function to fetch, format, and display the current date
function displayCurrentDate() {
  const dateElement = document.getElementById("current-date");
  if (dateElement) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const today = new Date();
    dateElement.innerText = today.toLocaleDateString("en-US", options);
  }
}

// Call the function immediately when the webpage loads
displayCurrentDate();

// Feature 4 & 5: Core dynamic UI rendering pipeline
function updateUI() {
  pendingList.innerHTML = "";
  completedList.innerHTML = "";

  const searchTerm = searchInput.value.toLowerCase().trim();

  // Filter out item objects targeting matching live filter strings
  let filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm),
  );

  let visiblePending = 0;
  let visibleCompleted = 0;

  filteredTasks.forEach((task) => {
    // Evaluate logic paths matching active view visibility toggles
    if (currentFilter === "pending" && task.completed) return;
    if (currentFilter === "completed" && !task.completed) return;

    const li = document.createElement("li");
    li.className = `task-item d-flex justify-content-between align-items-center ${task.completed ? "completed-state" : ""}`;

    li.innerHTML = `
            <span class="fw-medium flex-grow-1 text-break me-2">${task.title}</span>
            <div class="btn-group btn-group-sm flex-shrink-0">
                <button class="btn btn-sm btn-outline-primary border-0" onclick="toggleTask(${task.id})">${task.completed ? "↩️" : "✅"}</button>
                <button class="btn btn-sm btn-outline-warning border-0" onclick="openModal(${task.id}, '${task.title.replace(/'/g, "\\'")}')">✏️</button>
                <button class="btn btn-sm btn-outline-danger border-0" onclick="deleteTask(${task.id})">❌</button>
            </div>
        `;

    if (task.completed) {
      completedList.appendChild(li);
      visibleCompleted++;
    } else {
      pendingList.appendChild(li);
      visiblePending++;
    }
  });

  // Provide placeholder logs empty element view text
  if (visiblePending === 0) {
    pendingList.innerHTML = `<p class="empty-msg">No pending tasks.</p>`;
  }
  if (visibleCompleted === 0) {
    completedList.innerHTML = `<p class="empty-msg">No completed tasks.</p>`;
  }

  // Dynamic numeric track state totals updates
  const totalCount = tasks.length;
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  counterText.innerText = `Total: ${totalCount} | Pending: ${pendingCount} | Completed: ${completedCount}`;
}

// Feature 2: Add tasks using input bar and button click
function addTask() {
  const text = taskInput.value.trim();
  if (text === "") {
    alert("Task title description field cannot be left blank!");
    return;
  }

  tasks.push({
    id: Date.now(),
    title: text,
    completed: false,
  });

  saveData();
  taskInput.value = "";
}

// Feature 4: Toggle task complete status records state
function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task,
  );
  saveData();
}

// Feature 5: Delete task execution action logic routing
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveData();
}

// Feature 3: Inline edit layout initialization window configuration
function openModal(id, text) {
  currentEditId = id;
  modalInput.value = text;
  modal.classList.add("active-modal");
  modalInput.focus();
}

function closeModal() {
  modal.classList.remove("active-modal");
  currentEditId = null;
  modalInput.value = "";
}

// Feature 3: Save changes inline operational function routing
function saveEdit() {
  const newText = modalInput.value.trim();
  if (newText === "") {
    alert("Task text field updates cannot be blank!");
    return;
  }

  tasks = tasks.map((task) =>
    task.id === currentEditId ? { ...task, title: newText } : task,
  );
  saveData();
  closeModal();
}

// Feature 6: Store and reload the task list using browser localStorage
function saveData() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateUI();
}

// --- App Operations Interaction Handlers Mappings ---
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});
modalInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") saveEdit();
});
searchInput.addEventListener("input", updateUI);

filterControls.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    document
      .querySelectorAll("#filter-controls button")
      .forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");
    currentFilter = e.target.getAttribute("data-filter");
    updateUI();
  }
});

// Run application execution pipeline loops
displayDate();
updateUI();
