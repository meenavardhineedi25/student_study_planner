
/* =========================================
   STUDYFLOW - COMPLETE JAVASCRIPT
========================================= */


// =========================================
// GET HTML ELEMENTS
// =========================================

const taskModal = document.getElementById("taskModal");

const taskForm = document.getElementById("taskForm");

const closeModal = document.getElementById("closeModal");

const cancelModal = document.getElementById("cancelModal");

const heroAddBtn = document.getElementById("heroAddBtn");

const taskPageAddBtn =
    document.getElementById("taskPageAddBtn");

const taskName =
    document.getElementById("taskName");

const taskDescription =
    document.getElementById("taskDescription");

const taskSubject =
    document.getElementById("taskSubject");

const taskPriority =
    document.getElementById("taskPriority");

const dashboardTaskList =
    document.getElementById("dashboardTaskList");

const allTaskList =
    document.getElementById("allTaskList");

const searchInput =
    document.getElementById("searchInput");

const filterSelect =
    document.getElementById("filterSelect");


// =========================================
// LOAD TASKS FROM LOCAL STORAGE
// =========================================

let tasks =
    JSON.parse(localStorage.getItem("studyFlowTasks")) || [];


// =========================================
// SAVE TASKS
// =========================================

function saveTasks() {

    localStorage.setItem(
        "studyFlowTasks",
        JSON.stringify(tasks)
    );

}


// =========================================
// OPEN MODAL
// =========================================

function openModal() {

    taskModal.classList.add("show");

    taskName.focus();

}


// =========================================
// CLOSE MODAL
// =========================================

function closeTaskModal() {

    taskModal.classList.remove("show");

    taskForm.reset();

}


// =========================================
// BUTTON EVENTS
// =========================================

heroAddBtn.addEventListener(
    "click",
    openModal
);


taskPageAddBtn.addEventListener(
    "click",
    openModal
);


closeModal.addEventListener(
    "click",
    closeTaskModal
);


cancelModal.addEventListener(
    "click",
    closeTaskModal
);


// Close modal by clicking outside

taskModal.addEventListener(
    "click",
    function (event) {

        if (event.target === taskModal) {

            closeTaskModal();

        }

    }
);


// =========================================
// CREATE TASK
// =========================================

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            taskName.value.trim();

        const description =
            taskDescription.value.trim();

        const subject =
            taskSubject.value;

        const priority =
            taskPriority.value;


        if (name === "") {

            alert("Please enter a task name.");

            return;

        }


        const newTask = {

            id: Date.now(),

            name: name,

            description:
                description || "No description added",

            subject: subject,

            priority: priority,

            completed: false

        };


        tasks.unshift(newTask);


        saveTasks();


        renderTasks();

        updateDashboard();


        closeTaskModal();

    }
);


// =========================================
// RENDER TASKS
// =========================================

function renderTasks() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();

    const filter =
        filterSelect.value;


    let filteredTasks =
        tasks.filter(function (task) {

            const matchesSearch =
                task.name
                    .toLowerCase()
                    .includes(searchText) ||

                task.description
                    .toLowerCase()
                    .includes(searchText) ||

                task.subject
                    .toLowerCase()
                    .includes(searchText);


            const matchesFilter =
                filter === "all" ||

                (filter === "pending" &&
                    !task.completed) ||

                (filter === "completed" &&
                    task.completed);


            return matchesSearch &&
                matchesFilter;

        });


    renderTaskContainer(
        allTaskList,
        filteredTasks,
        true
    );


    // Dashboard only shows latest 4 tasks

    renderTaskContainer(
        dashboardTaskList,
        tasks.slice(0, 4),
        false
    );

}


// =========================================
// CREATE TASK HTML
// =========================================

function renderTaskContainer(
    container,
    taskArray,
    showEmpty
) {

    container.innerHTML = "";


    if (taskArray.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div>📝</div>

                <h4>
                    ${showEmpty
                        ? "No tasks found"
                        : "No tasks yet"}
                </h4>

                <p>
                    ${showEmpty
                        ? "Try adding a new task."
                        : "Add your first study task to get started."}
                </p>

            </div>

        `;

        return;

    }


    taskArray.forEach(function (task) {

        const taskElement =
            document.createElement("div");


        taskElement.className =
            "task-item";


        const priorityClass =
            task.priority.toLowerCase();


        taskElement.innerHTML = `

            <button
                class="check-btn
                ${task.completed ? "done" : ""}"
                onclick="toggleTask(${task.id})"
                title="Mark complete"
            >
                ${task.completed ? "✓" : ""}
            </button>


            <div class="
                task-info
                ${task.completed ? "completed" : ""}
            ">

                <strong>
                    ${escapeHTML(task.name)}
                </strong>

                <p>
                    ${escapeHTML(task.description)}
                </p>

            </div>


            <span class="task-tag">

                <span
                    class="priority-dot ${priorityClass}"
                ></span>

                ${escapeHTML(task.subject)}

            </span>


            <button
                class="delete-btn"
                onclick="deleteTask(${task.id})"
                title="Delete task"
            >
                🗑
            </button>

        `;


        container.appendChild(taskElement);

    });

}


// =========================================
// COMPLETE / UNCOMPLETE TASK
// =========================================

function toggleTask(id) {

    tasks = tasks.map(function (task) {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });


    saveTasks();

    renderTasks();

    updateDashboard();

}


// =========================================
// DELETE TASK
// =========================================

function deleteTask(id) {

    const confirmed =
        confirm("Delete this task?");


    if (!confirmed) {

        return;

    }


    tasks =
        tasks.filter(function (task) {

            return task.id !== id;

        });


    saveTasks();

    renderTasks();

    updateDashboard();

}


// =========================================
// UPDATE DASHBOARD
// =========================================

function updateDashboard() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const pending =
        total - completed;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    // Statistics

    document.getElementById(
        "totalTasks"
    ).textContent = total;


    document.getElementById(
        "pendingTasks"
    ).textContent = pending;


    document.getElementById(
        "completedTasks"
    ).textContent = completed;


    document.getElementById(
        "progressPercent"
    ).textContent =
        percentage + "%";


    // Progress ring

    document.getElementById(
        "ringPercent"
    ).textContent =
        percentage + "%";


    document.getElementById(
        "progressRing"
    ).style.setProperty(
        "--progress",
        percentage + "%"
    );


    // Mini progress

    document.getElementById(
        "miniCompleted"
    ).textContent =
        completed;


    document.getElementById(
        "miniRemaining"
    ).textContent =
        pending;


    // Progress page

    document.getElementById(
        "bigRingPercent"
    ).textContent =
        percentage + "%";


    document.getElementById(
        "bigRing"
    ).style.setProperty(
        "--progress",
        percentage + "%"
    );


    document.getElementById(
        "progressTotal"
    ).textContent =
        total;


    document.getElementById(
        "progressDone"
    ).textContent =
        completed;


    document.getElementById(
        "progressRemaining"
    ).textContent =
        pending;


    // Progress message

    const message =
        document.getElementById(
            "progressMessage"
        );


    if (total === 0) {

        message.textContent =
            "Start your first task today! 🌱";

    }

    else if (percentage === 100) {

        message.textContent =
            "Amazing! All tasks completed! 🎉";

    }

    else if (percentage >= 70) {

        message.textContent =
            "Excellent work! Keep going! 🔥";

    }

    else if (percentage >= 40) {

        message.textContent =
            "You're making great progress! 💪";

    }

    else {

        message.textContent =
            "Keep going, every task counts! 🌱";

    }

}


// =========================================
// SEARCH
// =========================================

searchInput.addEventListener(
    "input",
    renderTasks
);


// =========================================
// FILTER
// =========================================

filterSelect.addEventListener(
    "change",
    renderTasks
);


// =========================================
// NAVIGATION
// =========================================

const navItems =
    document.querySelectorAll(
        ".nav-item[data-section]"
    );


const sections =
    document.querySelectorAll(
        ".page-section"
    );


const pageTitle =
    document.getElementById(
        "pageTitle"
    );


const pageSubtitle =
    document.getElementById(
        "pageSubtitle"
    );


const titles = {

    dashboard: [
        "Dashboard",
        "Organize your learning and stay productive."
    ],

    tasks: [
        "My Tasks",
        "Manage all your study tasks."
    ],

    subjects: [
        "My Subjects",
        "Keep your subjects organized."
    ],

    progress: [
        "Progress Overview",
        "See how much you've accomplished."
    ]

};


navItems.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const sectionName =
                button.dataset.section;


            navItems.forEach(
                item =>
                    item.classList.remove(
                        "active"
                    )
            );


            button.classList.add(
                "active"
            );


            sections.forEach(
                section =>
                    section.classList.remove(
                        "active-section"
                    )
            );


            document
                .getElementById(sectionName)
                .classList.add(
                    "active-section"
                );


            pageTitle.textContent =
                titles[sectionName][0];


            pageSubtitle.textContent =
                titles[sectionName][1];

        }
    );

});


// =========================================
// VIEW ALL BUTTON
// =========================================

document.getElementById(
    "viewAllBtn"
).addEventListener(
    "click",
    function () {

        navItems.forEach(
            item =>
                item.classList.remove(
                    "active"
                )
        );


        document
            .querySelector(
                '[data-section="tasks"]'
            )
            .classList.add(
                "active"
            );


        sections.forEach(
            section =>
                section.classList.remove(
                    "active-section"
                )
        );


        document
            .getElementById("tasks")
            .classList.add(
                "active-section"
            );


        pageTitle.textContent =
            "My Tasks";


        pageSubtitle.textContent =
            "Manage all your study tasks.";

    }
);


// =========================================
// DARK MODE
// =========================================

const themeBtn =
    document.getElementById(
        "themeBtn"
    );


const themeBtnMobile =
    document.getElementById(
        "themeBtnMobile"
    );


const themeIcon =
    document.getElementById(
        "themeIcon"
    );


function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );


    const isDark =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "studyFlowDark",
        isDark
    );


    themeIcon.textContent =
        isDark ? "☀" : "☾";


    themeBtnMobile.textContent =
        isDark ? "☀" : "☾";

}


themeBtn.addEventListener(
    "click",
    toggleTheme
);


themeBtnMobile.addEventListener(
    "click",
    toggleTheme
);


// Load saved theme

const savedTheme =
    localStorage.getItem(
        "studyFlowDark"
    );


if (savedTheme === "true") {

    document.body.classList.add(
        "dark"
    );

    themeIcon.textContent = "☀";

    themeBtnMobile.textContent = "☀";

}


// =========================================
// SECURITY HELPER
// =========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// =========================================
// INITIAL LOAD
// =========================================

renderTasks();

updateDashboard();