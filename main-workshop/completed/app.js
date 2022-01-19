"use strict";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  getDocs,
  getFirestore,
  collection,
  onSnapshot,
  writeBatch,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8FJWs9vQ9nykRLKHfi_JTSOmus0X0BmM",
  authDomain: "qwerhacks-demo.firebaseapp.com",
  projectId: "qwerhacks-demo",
  storageBucket: "qwerhacks-demo.appspot.com",
  messagingSenderId: "350827830221",
  appId: "1:350827830221:web:dacab54a2d060e40564284",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const todoInput = document.getElementById("todo-input");
const todoContainer = document.getElementById("todo-container");
const doneAll = document.getElementById("done-all");
const nahAll = document.getElementById("nah-all");
let globalTodos = []; // rip, global state :(

// pure functions
// these are both functionally pure,
// and also won't be touched in the workshop!

// creates a JSON object representing a todo
const createTodoObject = (text, complete, id) => {
  return { text, complete, id };
};

// helper to make a new todo
const newTodoObject = (text) => {
  return createTodoObject(text, false, Date.now() + text);
};

// creates a 'DOM string' from a todo object
const createTodoString = (todo) => {
  // if only we had JSX :'(
  const { text, complete, id } = todo;
  const statusStr = complete ? "text-strikethrough" : "";
  return `
  <li>
    <span class="todo-text ${statusStr}">${text}</span>
    <span>
      <button class="action-button done-button" id="done-${id}">👌 done</button>
      <button class="action-button nah-button" id="nah-${id}">🤷 nah</button>
    </span>
  </li>
  `;
};

// flips the complete status of one todo
const flipTodoStatus = (todo) => {
  return { ...todo, complete: !todo.complete };
};

// toggles the complete status for just one todo
const toggleTodoStatus = (todos, id) => {
  return todos.map((todo) => {
    return todo.id === id ? flipTodoStatus(todo) : todo;
  });
};

// removes one todo from our list (by id)
const removeTodo = (todos, id) => {
  return todos.filter((todo) => todo.id !== id);
};

// "regenerates" all of the todos from our todos array
const generateTodos = (todos) => {
  return todos.map(createTodoString).join("");
};

// completes all todos

const completeAllTodos = (todos) => {
  return todos.map((todo) => {
    return { ...todo, complete: true };
  });
};

// impure functions
// all of these functions have side effects
// we'll modify quite a few of these during the workshop

// what we do when we click the done button
const onDoneClick = (todo) => {
  //globalTodos = toggleTodoStatus(globalTodos, todo.id);
  const chosenDoc = doc(db, "todos", todo.id);
  updateDoc(chosenDoc, {
    complete: !todo.complete,
  })
    .then(() => {
      regenerateTodos();
    })
    .catch(function (error) {
      console.error("Error updating document: ", error);
    });
};

// what we do when we click the nah button
const onNahClick = (id) => {
  //globalTodos = removeTodo(globalTodos, id);
  deleteDoc(doc(db, "todos", id))
    .then(
      () => {} //regenerateTodos()
    )
    .catch((error) => console.error("Error deleting doc: ", error));
};

// completes all the todos!
const onDoneAll = () => {
  const batch = writeBatch(db);
  const notDoneQuery = query(
    collection(db, "todos"),
    where("complete", "==", false)
  );
  getDocs(notDoneQuery)
    .then((snapshot) => {
      snapshot.docs.forEach((document) => {
        const docRef = doc(db, "todos", document.id);
        batch.update(docRef, { complete: true });
      });
    })
    .then(() => batch.commit())
    .catch((error) => console.error("Error on batch write: ", error))
    .catch((error) => console.error("Error getting documents: ", error));
  //regenerateTodos();
};

// resets (deletes) all todos!
const onNahAll = () => {
  const batch = writeBatch(db);
  getDocs(collection(db, "todos"))
    .then((snapshot) => {
      snapshot.docs.forEach((document) =>
        batch.delete(doc(db, "todos", document.id))
      );
    })
    .then(() =>
      batch
        .commit()
        .catch((error) => console.error("Error on batch write: ", error))
    )
    .catch((error) => console.error("Error getting documents: ", error));
};

// generates the listeners for every done and nah button
// is this inefficient? maybe ;)
const generateListeners = (todos) => {
  todos.forEach((todo) => {
    document.getElementById(`done-${todo.id}`).onclick = () =>
      onDoneClick(todo);
    document.getElementById(`nah-${todo.id}`).onclick = () =>
      onNahClick(todo.id);
  });
};

// regenerates our todos from scratch (rather than updating by id)
const regenerateTodos = () => {
  getDocs(collection(db, "todos"))
    .then((snapshot) => {
      const todos = snapshot.docs.map((doc) => doc.data());
      todoContainer.innerHTML = generateTodos(todos);
      generateListeners(todos);
    })
    .catch((error) => console.error("Error getting documents: ", error));

  generateListeners(globalTodos);
};

// our event listener for the text box, which adds a todo
// when the user hits enter with a non-empty input value
const handleTodoInput = (event) => {
  // why this? see https://stackoverflow.com/questions/11365632/how-to-detect-when-the-user-presses-enter-in-an-input-field
  if (!event) event = window.event;
  const keyCode = event.code || event.key;
  const text = todoInput.value;
  //when making a new one!
  if (keyCode == "Enter" && text !== "") {
    const newTodo = newTodoObject(text);
    setDoc(doc(db, "todos", newTodo.id), newTodo)
      .then(
        () => {} //regenerateTodos()
      )
      .catch((error) => console.error("Error adding doc: ", error));

    globalTodos.push(newTodo);
    //regenerateTodos();
    todoInput.value = "";
  }
};

todoInput.onkeypress = handleTodoInput;
doneAll.onclick = onDoneAll;
nahAll.onclick = onNahAll;
regenerateTodos();

const todosListener = onSnapshot(
  collection(db, "todos"),
  (snapshot) => {
    const todos = snapshot.docs.map((doc) => doc.data());
    todoContainer.innerHTML = generateTodos(todos);
    generateListeners(todos);
  },
  (error) => console.error("Error getting documents: ", error)
);
