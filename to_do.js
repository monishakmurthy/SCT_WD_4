// 🌠 Starry Background with Meteors
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let w, h;
let stars = [];
let meteors = [];

function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function createStars(count) {
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: Math.random() * 1.5,
      alpha: Math.random(),
      delta: Math.random() * 0.02
    });
  }
}

function drawStars() {
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.fill();
    star.alpha += star.delta;
    if (star.alpha <= 0 || star.alpha >= 1) star.delta *= -1;
  });
}

function createMeteor() {
  if (Math.random() < 0.02) {
    meteors.push({
      x: Math.random() * w,
      y: 0,
      dx: 4 + Math.random() * 2,
      dy: 4 + Math.random() * 2,
      length: 100 + Math.random() * 100,
      alpha: 1
    });
  }
}

function drawMeteors() {
  meteors.forEach((m, index) => {
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(m.x - m.length, m.y - m.length);
    ctx.strokeStyle = `rgba(255, 255, 255, ${m.alpha})`;
    ctx.lineWidth = 2;
    ctx.stroke();

    m.x += m.dx;
    m.y += m.dy;
    m.alpha -= 0.005;

    if (m.alpha <= 0) meteors.splice(index, 1);
  });
}

function animateSky() {
  ctx.clearRect(0, 0, w, h);
  drawStars();
  createMeteor();
  drawMeteors();
  requestAnimationFrame(animateSky);
}

createStars(150);
animateSky();


// 🌙 LunaList App Logic
const taskInput = document.getElementById("task");
const timeInput = document.getElementById("time");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;

    const text = document.createElement("div");
    text.className = "text";
    text.textContent = task.text;
    text.contentEditable = false;

    const datetime = document.createElement("div");
    datetime.className = "datetime";
    datetime.textContent = formatDateTime(task.datetime);

    const btnBox = document.createElement("div");
    btnBox.className = "buttons";

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✔️";
    completeBtn.onclick = () => toggleComplete(i);

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = () => editTask(i, text, li);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = () => deleteTask(i);

    btnBox.append(completeBtn, editBtn, deleteBtn);
    li.append(text, datetime, btnBox);
    taskList.appendChild(li);
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const text = taskInput.value.trim();
  const datetime = timeInput.value;
  if (!text) return;

  tasks.push({ text, datetime, completed: false });
  taskInput.value = "";
  timeInput.value = "";
  renderTasks();
}

function toggleComplete(i) {
  tasks[i].completed = !tasks[i].completed;
  renderTasks();
}

function editTask(i, textElem, liElem) {
  textElem.contentEditable = true;
  liElem.classList.add("editing");
  textElem.focus();

  textElem.onblur = () => {
    tasks[i].text = textElem.textContent.trim();
    textElem.contentEditable = false;
    liElem.classList.remove("editing");
    renderTasks();
  };
}

function deleteTask(i) {
  tasks.splice(i, 1);
  renderTasks();
}

function formatDateTime(isoStr) {
  if (!isoStr) return "";
  const dt = new Date(isoStr);
  return dt.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

addBtn.addEventListener("click", addTask);
renderTasks();
