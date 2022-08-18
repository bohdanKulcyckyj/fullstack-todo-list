import { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_PORT|| "http://localhost:3001";
console.log(API_BASE);

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  const GetTodos = () => {
    fetch(API_BASE + "/todos")
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.log("Error: ", err));
  }

  const completeTodo = async (id) => {
    const data = await fetch(API_BASE + "/todo/complete/" + id, { method: "PUT"})
      .then(res => res.json());
      
    setTodos(todos => todos.map(todo => {
      if(todo._id === data._id) {
        todo.complete = data.complete;
      }

      return todo;
    }));
  }

  const deleteTodo = async (id) => {
    const data = await fetch(API_BASE + "/todo/delete/" + id, { method: "DELETE"})
    .then(res => res.json());

    setTodos(todos.filter(todo => todo._id !== data._id));
  }

  const addTodo = async (newTodo) => {
    const data = await fetch(API_BASE + "/todo/new", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        text: newTodo
      })
    }).then(res => res.json());

    console.log(data);

    setTodos([...todos, data]);
    setNewTodo("");
  }

  const addTodoWindow = () => (
  <div className="new-todo-container">
    <div className="new-todo-content">
      <h4>Add task</h4>
      <input className="new-todo-input" type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
      <button className="new-todo-button" onClick={() => addTodo(newTodo)} >Create task</button>
      <span className="close-new-todo" onClick={() => setPopupActive(!popupActive)}>x</span>
    </div>
  </div>);

  useEffect(() => {
    GetTodos();
    console.log(todos);
  }, []);

  return (
    <div className="app">
      <h1>Welcome to my App</h1>
      <h4>Your Tasks</h4>
      <div className="todos">

        {todos.map(item => (
          <div className={item.complete ? "todo is-complete" : "todo"} key={item._id} onClick={() => completeTodo(item._id)}>
            <div className="todo-checkbox"></div>
            <div className="todo-text">{item.text}</div>
            <div className="todo-delete" onClick={(e) => {deleteTodo(item._id); e.stopPropagation();}}>x</div>
          </div>
        ))}

      </div>

      {popupActive ? addTodoWindow() : ""}

      <span className="plus-popup" onClick={() => setPopupActive(!popupActive)}>+</span>
      
    </div>
  );
}

export default App;
