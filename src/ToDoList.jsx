import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUp,
  faCircleDown,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
function ToDoList() {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }
  function addTask() {
    if (newTask.trim() !== "") {
      if (!tasks.some((tasksItem) => tasksItem.text === newTask)) {
        setTasks((t) => [...t, {text:newTask,complete:false}]);
        setNewTask("");
      } else {
        Swal.fire({
          title: "Already Exists",
          text: "This item already exists.",
          icon: "warning",
          confirmButtonText: "OK",
        });
      }
    }
  }
  function deleteTask(index) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this task!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        setTasks((t) => t.filter((task, i) => i !== index));
        Swal.fire(
          'Deleted!',
          'Your task has been deleted.',
          'success'
        );
      }
    });
  }
  function editTask(index) {
    let value = tasks[index];

    console.log(value, "value");
    Swal.fire({
      title: "Edit Todolist",
      input: "text",
      inputValue: value.text, // Set input value here
      inputPlaceholder: "Edit To Do", // Set placeholder here
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Save",
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const newTask = result.value;
        if (newTask.trim() == "") {
          Swal.fire({
            title: "Empty Task",
            text: "Please enter a valid task.",
            icon: "warning",
            confirmButtonText: "OK",
        });
        return;
      }
          if (!tasks.some((tasksItem) => tasksItem.text === newTask)) {
            tasks[index].text = newTask;
            setTasks((t) => [...t]);
            setNewTask("");
          } else {
            Swal.fire({
              title: "Already Exists",
              text: "This item already exists.",
              icon: "warning",
              confirmButtonText: "OK",
            });
          }
        }
      
    });
  }

  function moveTaskUp(index) {
    const updateTask = [...tasks];
    if (index > 0) {
      [updateTask[index], updateTask[index - 1]] = [
        updateTask[index - 1],
        updateTask[index],
      ];
      setTasks(updateTask);
    }
  }
  function moveTaskDown(index) {
    const updateTask = [...tasks];
    if (index < tasks.length - 1) {
      [updateTask[index], updateTask[index + 1]] = [
        updateTask[index + 1],
        updateTask[index],
      ];
      setTasks(updateTask);
    }
  }
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      addTask();
    }
  }
  function handlecompleteTaske(index,event){
setTasks((tasks)=>tasks.map((Obj,i)=>(i==index?{...Obj,complete:event.target.checked}:Obj)))
  }
const styles= {
  backgroundColor:"#ffff",
color:"black", 
}
  return (
    <div className="to-do-list">
      <h1> To-Do-List</h1>
      <input
        type="text"
        onKeyDown={handleKeyDown}
        placeholder="Enter A Task...."
        value={newTask}
        onChange={handleInputChange}
      />
      <button className="add-button" onClick={addTask}>
        Add
      </button>

      <div className="scrollable-container">
        <ol>
          {tasks.map((task, i) => (
            <li key={i} style={task.complete?styles:null}  >
            <input checked={task.complete?true:false} disabled={task.complete?true:false} onChange={((e)=>{handlecompleteTaske(i,e)})} type="checkbox" />
              <span className="text">{task.text}</span>
              <button className="delete-button" onClick={() => deleteTask(i)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button className="edit-button" onClick={() => editTask(i)}>
                <FontAwesomeIcon icon={faPenToSquare} />
              </button>
              <button className="move-button" onClick={() => moveTaskUp(i)}>
                <FontAwesomeIcon icon={faCircleUp} />
              </button>
              <button className="move-button" onClick={() => moveTaskDown(i)}>
                <FontAwesomeIcon icon={faCircleDown} />
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
export default ToDoList;
