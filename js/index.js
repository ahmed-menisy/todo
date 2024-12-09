const formElement = document.querySelector("form");
const inputElement = document.querySelector("input");
const apiKey = "67569dae60a208ee1fddc428";
const loadingScreen = document.querySelector(".loading");
let allTodos = [];

getAllTodos();

formElement.addEventListener("submit", (e) => {
  e.preventDefault();

  if (inputElement.value.trim().length > 0) {
    addTodos();
  }
});

async function addTodos() {
  showLoading();

  const todo = {
    title: inputElement.value,
    apiKey: apiKey,
  };

  const obj = {
    method: "POST",
    body: JSON.stringify(todo),
    headers: {
      "content-type": "application/json",
    },
  };

  const response = await fetch("https://todos.routemisr.com/api/v1/todos", obj);

  if (response.ok) {
    // status response ok

    const data = await response.json(); // {message:"success"}

    if (data.message === "success") {
      // GetAllData Todo Show
      toastr.success("Added Successfully", "Toastr App");
      await getAllTodos();
      formElement.reset();
    }
  }

  hideLoading();
}

async function getAllTodos() {
  showLoading();
  const response = await fetch(`https://todos.routemisr.com/api/v1/todos/${apiKey}`);

  if (response.ok) {
    // status Ok ---> 200   - 299

    const data = await response.json(); // {message:"success" , todos:[{}]}

    if (data.message === "success") {
      allTodos = data.todos; //[{} , {} , {}];
      displayData();

      console.log(allTodos);
    }
  }

  hideLoading();
}

function displayData() {
  let cartona = "";
  // allTodos  --> [{} , {} ,{}  , todo]
  //todo ---> Object -- item
  for (const todo of allTodos) {
    cartona += `
         
          <li class="d-flex align-items-center justify-content-between border-bottom pb-2 my-2">


          <span onclick="markCompleted('${todo._id}')"
           style=" ${todo.completed ? "text-decoration: line-through;" : ""} " class="task-name">
           ${todo.title}
            </span>



          <div class="d-flex align-items-center gap-4">

            ${todo.completed ? '<span><i class="fa-regular fa-circle-check" style="color: #63e6be"></i></span>' : ""}

            <span onclick="deleteTodo('${todo._id}')" class="icon"> <i class="fa-solid fa-trash-can"></i> </span>

          </div>
        </li>

         `;
  }

  document.querySelector(".task-container").innerHTML = cartona;

  changeProgress();
}

async function deleteTodo(idTodo) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      //Code Delete

      // confirm Call Api
      showLoading();

      const todoData = {
        todoId: idTodo,
      };

      const obj = {
        method: "DELETE",
        body: JSON.stringify(todoData),
        headers: {
          "content-type": "application/json",
        },
      };

      const response = await fetch("https://todos.routemisr.com/api/v1/todos", obj);

      if (response.ok) {
        const data = await response.json();

        if (data.message === "success") {
          /// getAll Data
          Swal.fire({
            title: "Deleted!",
            text: "Your Todo has been deleted.",
            icon: "success",
          });

          await getAllTodos(); // Api Get Todo
        }
      }

      hideLoading();
    }
  });
}

async function markCompleted(idTodo) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Complete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      showLoading();

      const todoData = {
        todoId: idTodo,
      };

      const obj = {
        method: "PUT",
        body: JSON.stringify(todoData),
        headers: {
          "content-type": "application/json",
        },
      };

      const response = await fetch("https://todos.routemisr.com/api/v1/todos", obj);

      if (response.ok) {
        // tmammmmmm

        const data = await response.json(); // response api

        if (data.message === "success") {
          //Get All Todos
          Swal.fire({
            title: "Completed!",

            icon: "success",
          });
          getAllTodos();
        }
      }

      hideLoading();
    }
  });
}

function showLoading() {
  loadingScreen.classList.remove("d-none"); // Show Loading
}

function hideLoading() {
  loadingScreen.classList.add("d-none"); // hide Loading
}

function changeProgress() {
  // allTodos  ===> [{} , {} , {} ]   -   todo  {}

  const completedTaskNumber = allTodos.filter((todo) => todo.completed).length; // 5
  const totalTask = allTodos.length; // 10

  document.getElementById("progress").style.width = `${(completedTaskNumber / totalTask) * 100}%`;

  const statusNumber = document.querySelectorAll(".status-number span");

  statusNumber[0].innerHTML = completedTaskNumber;
  statusNumber[1].innerHTML = totalTask;
}
