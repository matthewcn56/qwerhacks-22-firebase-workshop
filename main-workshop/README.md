# Firestore 101, The Main Firestore Workshop

This README contains the notes for the entire main Firebase/Firestore workshop, where **we make a client-side todo list app persistent and multi-user**. It's an updated version of the workshop that Matt Wang hosted last year for Firebase, and updates firebase from v8 to v9!

It is split up into several byte-sized chunks:

0. What is Firebase/Firestore and Demo Code Tour
1. Setting up Firestore and the Firebase Console
2. Creating, Reading, Updating, and Deleting Data with Firestore
3. Cool Tricks with Firestore: Listeners, Batched Writes, Querying

You don't need to be an HTML/CSS/JS pro to do this workshop, but a passing familarity is recommended.

[Here's a link to the playlist, follow along if you'd like!](https://www.youtube.com/watch?v=gSlGbgk54sM&list=PLPO7_kXilXFb0_hrPKxlx-UEhZHiiTEWY)

This workshop is meant to be web framework agnostic, so we implement everything in vanilla JavaScript. Everything we cover is generally extendable to any frontend framework. We cover React in a bonus part of the workshop!

## Table of Contents

- [What is Firebase/Firestore and Demo Code Tour](#what-is-firebasefirestore-and-demo-code-tour)
  - [What is Firebase?](#what-is-firebase)
  - [A Bit More on Firestore and Some Vocab](#a-bit-more-on-firestore-and-some-vocab)
  - [The Demo Code](#the-demo-code)
- [Setting up Firestore and the Firebase Console](#setting-up-firestore-and-the-firebase-console)
  - [Creating a Project](#creating-a-project)
  - [Registering a Firebase Web App](#registering-a-firebase-web-app)
  - [Firestore Setup](#firestore-setup)
- [Basic Data Operations (CRUD) in Firestore](#basic-data-operations-crud-in-firestore)
  - [Creating Sample Data](#creating-sample-data)
  - [Basic Read Operations](#basic-read-operations)
  - [Creating Data Programatically](#creating-data-programatically)
  - [Deleting Data](#deleting-data)
  - [Updating Data](#updating-data)
- [Cool Tricks with Firestore: Listeners, Batched Writes, Querying](#cool-tricks-with-firestore-listeners-batched-writes-querying)
  - [Listeners](#listeners)
  - [Batched Writes](#batched-writes)
  - [Querying](#querying)
- [Conclusion and Next Steps](#conclusion-and-next-steps)
- [Licensing, Attribution, and Resources](#licensing-attribution-and-resources)

## What is Firebase/Firestore and Demo Code Tour

### What is Firebase?

[Firebase](https://firebase.google.com/) is a "comprehensive app development platform" designed to make developers' lives easier. Specifically, it implements a lot of common back-end functionalities for you (like database management, user authentication, analytics, hosting, monitoring, and testing).

Today, we'll use **Cloud Firestore**, which is a database scheme and manager provided by Firebase. It simplifies a huge (and I really mean huge) part of making apps. In particular, it is **document-based** (rather than SQL-like), which is a concept that we'll delve into in a moment.

For us, Firebase itself will manage deploying and hosting the database server; we'll use Firebase's JavaScript library to communicate with that server. In the next section, I'll walk you through how to set up a Firebase app that uses Firestore.

Firebase is a product that's sold by Google, though many of its supporting libraries are open-source. For most small projects (and likely, your hackathon project), Firebase and Firestore are completely free to use. You can see more on Firebase's [pricing page](https://firebase.google.com/pricing); you're likely going to be using the Spark Plan.

### A Bit More on Firestore and Some Vocab

_Feel free to skip this part if you're not particularly interested in the technical backgorund of things!_

Let's take a look at what the [**Cloud Firestore**](https://firebase.google.com/products/firestore) site says:

> Cloud Firestore is a NoSQL document database that lets you easily store, sync, and query data for your mobile and web apps - at global scale.

If you're unfamiliar with databases, this is a scary sentence! Let's take some time and unpack what each of these words mean.

First, the general database stuff:

- a **database** is just a structured way to store some **data**. Data could be text (strings), numbers, and even complicated objects like analytics data or images.
- **SQL** is a language used to manage something called a _relational database_. SQL is very powerful and is a very complicated topic; we'll oversimplify and say that it's basically a set of tables. SQL power users, don't get mad!
- **NoSQL** databases are ... non-SQL, and typically non-relational databases. To continue our oversimplificiation, we'll say that data is structured less _rigidly_ than tables.
- **document databases** are a type of NoSQL database! In particular, the _unit_ for data collections are **documents**: sets of keys and values that describe both the structure and the content of the data. Contrast this to a table, where each row has the same column values.

What about the operations on data?

- **storing** data in this case refers to **persistence**. When we "save" our data, we can be sure that it'll be there, even after the user closes our app. Complicated apps run into many complex problems when storing lots of data!
- **syncing** data makes sure that everybody is on the same page when data is changed. This sounds like a simple problem, but gets complicated as your app has more users, more servers, and complex operations.
- **querying** data means sifting through a database to find the right data. Sometimes, it's very simple, like "give me all the data!!!". In other instances, it can be complex: "give me the first five Tweets by date that mention Rina Sawayama and were retweeted by somebody you follow".

With that in mind, what's the problem that Firestore aims to solve? I'd categorize it into two, distinct problems:

1. **In general, managing a database is lots of work.** You have to deploy a server, deal with security, update the software, and troubleshoot bugs. **Firestore does this all for you**, so you can focus on making your app!
2. **Scaling databases is particularly hard.** There are lots of problems once your app becomes complex: how do you sync between multiple clients? Multiple servers? Deal with lag? Concurrent operations? Firestore's engineers have built stuff to **make this easier**, though there are some trestrictions.

In particular, our goal with Firestore is to remove all dependence on global state in our app; we will make Firestore the "single source of truth". More on that as we code!

### The Demo Code

It's a bit tricky to explain how to use Firestore without an existing app. Since the scope of this workshop _is not how to make a web-app_, I'm not going to directly cover it in this workshop.

Instead, we're going to start with a sample app, which in this case, is a very barebones to-do list. You can [play around with a live demo here](https://raw.githack.com/mattxwang/qwerhacks-21-workshops/main/firebase/main-workshop/starter-code/index.html), or take a peek at the [starter-code folder and README](https://github.com/mattxwang/qwerhacks-21-workshops/tree/main/firebase/main-workshop/starter-code).

A few notes about this app:

- don't worry about understanding _all_ of the code! we won't be touching most of it, and I'll explain the relevant parts in due time. I also hope that I named and commented things well enough!
- it is written in just vanilla JavaScript. In other words, we aren't using anything like React. This is so I can focus on explaining Firestore _without_ also having to explain React, Angular, etc. You can easily take what we do and extend it to those frameworks!
- if you're particularly interested on using Firestore with React, I've also written an addendum to this workshop that takes the app we made in the React 101 workshop, and adds in Firestore. Take a look! TODO
- as an aside, this is _not_ the most efficient way to write a to-do list in vanilla JS. I intentionally chose it this way (i.e. FP + entire-list regeneration on every iteration) since this is _most similar_ to how hackathon projects are written (in my humble opinion). Please don't take this as gospel!

Of course, if there's something that you don't understand, or you find a bug - feel free to let me know! You can always email me at [matt@matthewwang.me](mailto:matt@matthewwang.me), or use the mentor channel at QWER Hacks.

If you want to try out a live version that's hooked up to the database and try sending some messages to me, check out a live version [here](https://qwerhacks-22-firebase-demo.netlify.app/).

Ok, let's get started!

## Setting up Firestore and the Firebase Console

Before we do any coding, we first need to set up our project through Firebase. As Firebase is a Google product, _you have to have a Google account_ for the rest of this workshop. Unfortunately, there's no getting around that.

We also assume that **you've already downloaded the demo project**. If you haven't, please do that now!

### Creating a Project

First, head to [the Firebase homepage](https://firebase.google.com/). You can hit the "Get Started" or "Go to console" button, they do the same thing.

![firebase homepage](./images/firebase-00-home.png)

You'll be presented with either a list of projects, or a wizard. If you're on a list, hit the "Add project" button.

![firebase projects page](./images/firebase-01-projects.png)

We can name our project whatever you want!

![firebase name a prjoect page](./images/firebase-02-name-project.png)

For the sake of this tutorial, I won't enable Google Analytics (since it requires more setup). However, it's a useful tool if you're looking to explore!

![firebase disable GA for your projects](./images/firebase-03-no-ga.png)

Once you finish that, your project should be all set up! But, we've got to do a bit more configuration: for the Firebase app, and for Firestore.

### Registering a Firebase Web App

Once you make your project, you'll probably be taken to a page like this. Hit the button to add a web application to your project.

![firebase project home page](./images/firebase-04-proj-home.png)

Once you're in the menu, we'll go through a few options, First, register your app with a nickname. It's not insanely important what it will be, but we'll use it in our configuration.

![firebase register new web app](./images/firebase-05-name-web-app.png)

In our case, we're not going to deploy/host with Firebase. However, it's a useful tool!

Now, we're going to be taken to an "Add Firebase SDK" page. It'll give us some code that's actually a bit useful. Copy that code to your clipboard...

![firebase copy firebase SDK code](./images/firebase-06-add-firebase-sdk.png)

... and we'll put it in our app! In particular, head to `index.html`, and bop it in at the end of the `<body>` tag, but above the `app.js` script tag. We also need to add the script tag for firestore; **please copy this too** (it's not directly in the screenshot):

```html
    <!-- The core Firebase JS SDK is always required and must be listed first -->
<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD8FJWs9vQ9nykRLKHfi_JTSOmus0X0BmM",
    authDomain: "qwerhacks-demo.firebaseapp.com",
    projectId: "qwerhacks-demo",
    storageBucket: "qwerhacks-demo.appspot.com",
    messagingSenderId: "350827830221",
    appId: "1:350827830221:web:dacab54a2d060e40564284"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
</script>
  </body>
</html>
```

Something you might notice is that we have to define our script as `type="module"`. This is because Firebase recently updated to a new API which is **modularized**, and requires us to use javascript modules instead of global scripts.

Normally, you won't commit API keys to GitHub repos, but with Firebase things are a bit different - since your app is entirely in the frontend, there is no way to properly obscure the key. Firebase instead ensures secure data through its [security rules](https://firebase.google.com/docs/firestore/security/overview).

We'll get back to using this in a moment. For now, let's finish our Firestore setup!

### Firestore Setup

Head to the Cloud Firestore page in your project, and hit Create database.

![firestore homepage](./images/firebase-07-firestore-home.png)

We can choose to run in test mode - at this point in our app, unauthorized access is unlikely, and things aren't going to spiral out of control. However, security rules are important!

![firestore create database in test mode](./images/firebase-08-create-database.png)

Next, we'll have to pick a data centre location. I'm in Los Angeles, California, so I'm going to pick something in the `us-west*` range. You can pick whichever region suits you best - keep in mind that many of our judges are on the west coast!

![firestore set database location](./images/firebase-09-set-db-region.png)

Cool, now our Firestore has been officially set up!

We can now move on to doing some ~ app work ~!!!

## Basic Data Operations (CRUD) in Firestore

**CRUD** - **creating, reading, updating, and deleting** - is a really common set of database operations. So, we'll start off with walking through those operations with Firestore, through the lens of our to-do app. By the end of this section, we'll make our basic app functionality fully persistent!

Something to keep in mind: our goal is to replace all instances of global state (marked by the `globalTodos` variable) with the use of Firestore as the single source of truth.

If you fall behind, you can check the code snippets within the readme or within our [completed example](https://github.com/matthewcn56/qwerhacks-22-firebase-workshop/tree/main/main-workshop/completed) to see how we changed the functions around!

### Creating Sample Data

Before we do any data, let's first figure out the structure of what we want, and create some dummy variables. This is always a good thing to do _before_ you start coding: knowing how your data should be layed out is half the battle!

If you take a peek at our starter code, you'll see that I've already defined the structure of a todo: currently, it has:

1. the `text` of the todo
2. the `complete` boolean field, that marks whether or not the todo should be "completed" (strikethrough)
3. an `id` that joins the timestamp and todo text; we'll make use of this later

Each object is then put into a global array that defines the order of the todos, and rendered into the app. We'll find later that this doesn't match up one-to-one with how Firebase wants it to be, but we'll cross that bridge when we get there.

Let's switch gears to Firestore now. If you have no data yet, your Firestore panel will look like this:

![firestore empty database](./images/firebase-10-empty-firestore.png)

Let's start a **collection**. As we've mentioned, Firebase is a **document-based** database system. Collections in Firestore hold documents. In our case, we can think of one "to-do" as a document; the collection that holds these can be the todos collection.

![firestore create collection](./images/firebase-11-create-collection.png)

In Firestore, every item in a document must have a unique ID, or a key. You can think of a collection as a dictionary or a map. For now, we'll auto-generate the ID; later in our app we'll use something else.

Each document itself has more key-value pairs, with different types. Interesting, each document in a collection can have _different sets_ of keys; we're not going to delve too deeply into that though!

We can now define our first document in our todos collection. So far, we'll just do `text` and `complete`; conveniently, they can match up with our JS types pretty easily.

![firestore create document](./images/firebase-12-create-document.png)

Once you make the document, you can see what the hierarchy looks like in the interface. At the top-level, we have all of our collections; after that, we have our `todos` collection, and it currently has one `todo`.

![firestore document structure](./images/firebase-13-collection-structure.png)

Great! We've thought about our data and made a sample document. Now, let's see if we can read that todo.

### Basic Read Operations

Now that we've made some data, let's see if we can read and display it.

Let's take a look back at our code that we had to copy and paste up above before into our `index.html`

```html
<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
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
</script>
```

Let's move all of the script into the very top of our `app.js` and we can now change our script tag to just say

```html
<script type="module" src="app.js"></script>
```

Now within our app.js, we can initialize our database client just underneath where we initialized our firebase app, with the `getFirestore()` function which we can download from the firebase-firestore CDN!

```js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore();
```

This `db` reference is our entrypoint into our database. We only need to initialize it once!

Now, we can use our `db` to read some things. The function that actually gets and renders all of our todos is called `regenerateTodos()`:

```js
// regenerates our todos from scratch (rather than updating by id)
const regenerateTodos = () => {
  todoContainer.innerHTML = generateTodos(globalTodos);
  generateListeners(globalTodos);
};
```

This function does two things:

1. it takes all the todos, currently from `globalTodos`, and turns them into HTML elements with `generateTodos`
2. then, it takes all the todos, currently from `globalTodos`, and activates the "done" and "nah" buttons on each todo

If we want to inject Firestore into this routine, all we need to do is change the variable `globalTodos` to the `todos` collection. Here's how we can do that, with the collection and getDocs functions from firestore:

```js
//include the functions necessary inside our import!
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js";

// regenerates our todos from scratch (rather than updating by id)
// now uses firestore!
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
```

Oh wow, there's a bunch of stuff going on here! Let's quickly break it down.

First, `collection(db, "todos")` is a reference to our `todos` collection that we made earlier within the firestore database of our firebase app. Calling `getDocs(collectionRef)` on a collection reference gives us _all_ of the documents in the collection; later, we'll see how we can query the data instead.

Then, we have this `.then` and `.catch` business. If you haven't seen this before, that's totally okay! These are called **Promises**. Promises are used to deal with asynchronous behaviour - actions that may take a long time and run "independently" with the rest of our code - and in particular, are useful when we _need_ one action to happen _before_ the other. Database reads, like ours, are a classic example. They take some time, and we only want to update our todos when the read is successful; if it fails, we should do something else.

That's exactly what our code does. Both of `.then` and `.catch` take in functions for arguments; `.then`'s function gets called when the request is successful, while `.catch` gets called if it fails. Hopefully, the `.catch` is pretty self-explanatory.

What's going on with the inside of our `.then`? Firestore's `getDocs(collectionRef)` returns a collection "snapshot", which is the status of the collection at a certain time period.

We can use the `.docs` property of a snapshot to get an array of every document in the collection, sorted by the key (for now, we only have one document, so this isn't a huge deal). Each document itself has two fields: `.id()` and `.data()`; they contain the document ID and the document contents respectfully. We'll map our snapshot into an array of todo data fields (wrapping up our `const todos` declaration).

Then, we just plug our `todos` array into the two lines from our non-database version - the way we've written the code, everything works out!

![working firestore read](./images/01-working-read.png)

Omg! Look at that! Things are working out just fine!

I know we just threw a bunch of code at you, but the best way to get more practice is to just start using Firestore more. I promise you, things aren't too too tricky to get used to.

Now, let's work on getting creating data to work properly :)

As a quick recap, we:

- created a Firestore database reference called `db`
- accessed a collection in our database using `.collection()`
- used `.get()` to get a snapshot of our data, with promises
- used our resulting data to generate our to-do

### Creating Data Programatically

Now that we've read some data to our database, we want to be able to write data to it too! In particular, when we create a todo, we should add it to our Firestore database.

The function that handles creating new todos is here:

```js
// our event listener for the text box, which adds a todo
// when the user hits enter with a non-empty input value
const handleTodoInput = (event) => {
  // why this? see https://stackoverflow.com/questions/11365632/how-to-detect-when-the-user-presses-enter-in-an-input-field
  if (!event) event = window.event;
  const keyCode = event.code || event.key;
  const text = todoInput.value;
  if (keyCode == "Enter" && text !== "") {
    const newTodo = newTodoObject(text);
    globalTodos.push(newTodo);
    regenerateTodos();
    todoInput.value = "";
  }
};
```

The first bit is a set of input handlers; the important bit is the lines:

```js
const newTodo = newTodoObject(text);
globalTodos.push(newTodo);
regenerateTodos();
```

What do we need to change here? All we need to do is change this `globalTodos.push` statement to instead push `newTodo` to Firestore. Since `regenerateTodos()` already pulls from Firestore, we don't need to do any global updating!

Here's what we're going to change those lines to instead:

```js
//adding in setDoc, doc to our import!
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js";

const newTodo = newTodoObject(text);
setDoc(doc(db, "todos", newTodo.id), newTodo)
  .then(() => regenerateTodos())
  .catch((error) => console.error("Error adding doc: ", error));
```

What's going on here?

- `doc(db, "todos", newTodo.id)` gets a reference to a document in the collection with the Firestore ID given by `id`. In our case, we (hope) that our IDs are unique, so there shouldn't be one for our just-made todo. IDs are important; we'll talk about them later!
- `setDoc(docRef, docData)` does one of two things: if the document doesn't exist (like in our case), it will create it and set the data to be whatever we pass in. If the document does exist, it'll **completely overwrite** the resulting data.
- `setDoc()` returns a promise. On an error, we just log the error. The interesting case is our `.then` - here, we only regenerate our todos **after** our document was created. This makes sure that we only pull data after our document has been created, not before!

That's it! And it works out of the box - we only needed to adjust that line of code. This works because `newTodo` is a simple JavaScript object (just key-value pairs), so Firebase can automatically handle turning it into a document.

![gif of user typing in "i don't feel like doing anything at all" and creating a todo](./images/02-working-write.gif)

Yup, adding a document was really _that_ easy. Of course, as your data becomes more complex, your document does too - but the procedure (calling `setDoc(docRef)` on a document reference) is the same.

Next, let's get some of our buttons working - probably the "nah" button first!

As a quick recap, we covered:

- using the `doc(db, "collectionRef", documentID)` function on a collection to get a document (which may or may not exist)
- using the `setDoc(docRef, docData)` function on a document to create it, with some accompanying data
- performing dependency actions synchronously, i.e. regenerating the todos _after_ creating one

### Deleting Data

Okay, so now we can create and read todos. Let's first deal with deleting them.

This function handled deleting a document earlier:

```js
const onNahClick = (id) => {
  globalTodos = removeTodo(globalTodos, id);
  regenerateTodos();
};
```

As always, our goal is to replace the `globalTodos` line. Luckily, Firestore has a one-line (ish) solution for us!

```js
//adding in deleteDoc to our imorted functions!
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js";
const onNahClick = (id) => {
  deleteDoc(doc(db, "todos", id))
    .then(() => regenerateTodos())
    .catch((error) => console.error("Error deleting doc: ", error));
};
```

Here, we get a reference to the document with `doc()`, as usual. Then, we just call `deleteDoc(docRef))`, and set up a Promise to let us know if something goes wrong. If our request is successful, _then_ we regenerate our todos. This is the same pattern as the previous section, but it's really important!

![gif of user deleting a todo, and then panicking because the other one is broken](./images/03-working-delete-kinda.gif)

It mostly works, but you might notice that our dummy todo doesn't delete properly. That's because **we never set the document ID for it**! But that's okay, you can delete things in the firebase console:

![gif of user deleting the broken todo in firebase](./images/03-firebase-delete-success.gif)

And great! You should be able to create and delete todos as you wish. Exciting news!

As a quick recap, we covered:

- the `deleteDoc(docRef)` operation on a firestore document
- again, the importance of chaining dependent synchronous actions
- deleting items in the firestore console

### Updating Data

Last but not least, let's implement the "done" feature for our app. You might guess what we already want to do - find the function that we've written to toggle the single item, and instead of updating the global state, adjust the field in the firestore document.

First, let's do a quick refactor. We're going to make `onDoneClick` pass in the entire `todo` object, not just the ID; we want to know the current status, so we can flip it.

```js
// generates the listeners for every done and nah button
// is this inefficient? maybe ;)
const generateListeners = (todos) => {
  todos.forEach((todo) => {
    document.getElementById(`done-${todo.id}`).onclick = () =>
      onDoneClick(todo.id);
    document.getElementById(`nah-${todo.id}`).onclick = () =>
      onNahClick(todo.id);
  });
};
```

to

```js
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
```

Now, let's refactor our `onDoneClick`; change from

```js
const onDoneClick = (id) => {
  globalTodos = toggleTodoStatus(globalTodos, id);
  regenerateTodos();
};
```

to this:

```js
//adding updateDoc to our import!
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js";

const onDoneClick = (todo) => {
  const docRef = doc(db, "todos", todo.id);
  updateDoc(docRef, {
    complete: !todo.complete,
  })
    .then(() => regenerateTodos())
    .catch((error) => console.error("Error updating document: ", error));
};
```

Hopefully that's not too complicated; a step-by-step:

1. `todo` holds the current state of our todo object
2. we get a reference to the document, with `todo.id`
3. we call the `updateDoc(docRef)` function; this is like `setDoc()`, but only updates the mentioned keys (instead of completely replacing the document)
4. then, we regenerate the todos once the update succeeds

![gif of user completing a todo](./images/04-working-update.gif)

And that's it! Hopefully, you're starting to get the feel for Firestore's basics!

As a quick recap, this covers:

- using `updateDoc(docRef)` on a document (instead of `setDoc(docRef)`)

## Cool Tricks with Firestore: Listeners, Batched Writes, Querying

Now that we've nailed the basic CRUD operations, I think we should take a look at some of the cooler features that Firestore offers. Each of these can make your project just _that_ much more powerful! We'll also use this as an opportunity to polish off the rest of our app's functionality.

### Listeners

One thing you'll notice is that if a change happens outside of our app, we have to refresh our app to see the change happen. You can do this by having two copies of our app open, or changing the variable in the console. If you want a todo app that can be shared between teams (like Google Docs), then this is a must-have feature.

We can implement this using something called a "listener". A listener, well, _listens_ for changes to something: every time the document or collection changes, it can automatically update our app. How convenient!

Luckily for us, Firestore makes listeners super easy to implement. Here's what we're going to do; at the end of the `app.js` file, let's bop this down:

```js
//adding onSnapshot to our import!
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js";

const todosListener = onSnapshot(
  collection(db, "todos"),
  (snapshot) => {
    const todos = snapshot.docs.map((doc) => doc.data());
    todoContainer.innerHTML = generateTodos(todos);
    generateListeners(todos);
  },
  (error) => console.error("Error getting documents: ", error)
);
```

Then, you should remove/comment out every line that calls `regenerateTodos()`. Why's that? Previously, we had to manually call `regenerateTodos()` to get the latest copy of our data. Our listener handles that now, so we don't have to worry about it at all!

And it works!

![gif of two todo windows open; the user updates a todo in one, and sees the changes in the other](./images/05-working-listener.gif)

What's going on here? This looks _so much_ like our read data code!

1. we're using the `onSnapshot(collectionRef)` **listener**. every time the `todos` collection changes, the first function is called.
2. logically, this function does exactly what our read data code does; it gets the documents and maps them into todos!
3. the second function is an error function that gets called when there's a mistake, like if there's no internet, or if the user permissions change.

And that's it!

Quickly, some extra notes on listeners:

- listeners aren't _always_ the answer! you should really think to yourself: does your app need live-listening? does it make more sense to make the user refresh?
- this is not the most efficient way to use our listener. we could listen for only the items that changed, and then _just_ update those. Take a look at ["View changes between snapshots"](https://firebase.google.com/docs/firestore/query-data/listen?authuser=0#view_changes_between_snapshots) for a worked example.
- if you know you need to stop the listener before the app closes (e.g. a user logs out), you should "unsubscribe" the listener. more on that in ["Detach a listener"](https://firebase.google.com/docs/firestore/query-data/listen?authuser=0#detach_a_listener)

If you'd like, you can now delete `regenerateTodos()`; we're not going to use it anymore. There are also other ways to refactor these functions if we'd like!

As a quick recap, we covered:

- using `onSnapshot()` and its three arguments: the collectionRef to listen for changes to, the function called on every change, and the error function

### Batched Writes

There are many issues with databases that Firebase aims to solve. One is: how do we make sure that multiple interactions happen at the same time, given that each operation can only happen one-after-the-other? In our case, this is relevant for the "nah all" button: we want to delete all of the todos at once, rather than sending a bajillion requests.

One neat type of Firestore functionality is **batched writes**. This lets you queue up several create/update/delete operations together and execute them _all at once_! It's a great solution for our problem, but also is super relevant for many other (higher-stakes) problems too.

(as a note: none of your operations can involve _reads_. Ours doesn't, so we're chilling!)

Let's use batched writes to flesh out our `onNahAll` function. Start with this:

```js
const onNahAll = () => {
  globalTodos = [];
};
```

And we're going to give it a quick ~ transformation ~ :

```js
//adding in writeBatch to our import!
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  writeBatch,
} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js";

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
```

Oop! This is a lot. Let's break it down:

1. first, we create a `batch` object with `writeBatch(db)`. We're going to use this a lot!
2. we get every single todo with `getDocs()`; take a peek at [Basic Read Operations](#basic-read-operations) for more info!
3. on each document in the collection, we add it to our batch transaction with `batch.delete()`. note that a) we can't just pass `doc` in, and b) **we haven't actually deleted it yet**
4. once we've completed all of our `.forEach()` iterations, we _then_ actually perform the batch operation with `batch.commit()`
5. we have a few `catch` statements in case there's an error

Take your time to digest this code if you'd like, it's not the most readable.

And let's see it in action:

![gif of delete all button working](./images/06-working-nah-all.gif)

This is a great toy example of using batched writes, though as you can imagine, they can become much more complex. [Check out the documentation for more info](https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes). And as you can imagine, `batch.set()` and `batch.update()` exist and do similar things.

Batched writes also have a friend - [transactions](https://firebase.google.com/docs/firestore/manage-data/transactions) - that allow you to read, but with additional restrictions.

(as an aside, there's a slight caveat here: we're kind of [deleting the collection](https://firebase.google.com/docs/firestore/manage-data/delete-data), which has some gotchas. [check out the docs](https://firebase.google.com/docs/firestore/manage-data/delete-data) for more info)!

As a quick recap, we:

- created a batch request object with `writeBatch(db)`
- added items to the queue with `batch.delete()` or (`batch.update()`, `batch.set()`)
- executed the batch with `batch.commit()`

### Querying

We have one last operation to finish, which is our "done all" button. There are quite a few ways to approach this problem, but one way to do it is with a **query**. Queries are ways we can ask our database (in this case, Firestore) to give us only _certain types_ of data. This is a really common operation in many applications: give us tweets from a certain time period, people that you're friends with, songs by girl in red.

In this case, let's take all the todos that aren't done, and batch write them to all be done. It's a great use of querying and what we've learned in the past workshop!

Take this:

```js
// completes all the todos!
const onDoneAll = () => {
  globalTodos = completeAllTodos(globalTodos);
};
```

and plop this in instead:

```js
//add in where, query to our import statement!

const onDoneAll = () => {
  const batch = db.batch();
  const notDoneQuery = query(
    collection(db, "todos", where("complete", "==", false))
  );
  getDocs(notDoneQuery)
    .then((snapshot) => {
      snapshot.docs.forEach((document) => {
        const docRef = doc(db, "todos", document.id);
        batch.update(docRef, { complete: true });
      });
    })
    .then(() =>
      batch
        .commit()
        .catch((error) => console.error("Error on batch write: ", error))
    )
    .catch((error) => console.error("Error getting documents: ", error));
};
```

Woah, what's going on here? We can break it down like our delete all functionality:

1. create a batch object
2. before our `.get()`, we use `.where()`. this lets us put in a condition - in this case, whether the field `complete == false`; then, when we run `.get()`, we'll only got documents that fulfill this condition!
3. for each of the documents that aren't complete, we get ready to batch an update that sets `complete = true`
4. once we're done, we commit our batch update, and things work out!

Take a peek:

![gif of done all button working](./images/07-working-done-all.gif)

Voila!

And with that, **we've completely removed our reliance on global state**! Instead of keeping track of the to-dos in memory, we perform **all of our operations with Firestore**. In particular, you'll note that you and a friend can both use the same to-do list, with great syncing. We did it!

Firestore supports multiple queries and more complex ones too! If you're interested, I'd recommend that you [check out the docs](https://firebase.google.com/docs/firestore/query-data/queries)!

As a quick recap, we:

- learned how to use `.where()` to perform a simple query
- used a batch `.update()` write operation

This is it for the main content of the workshop! If you want to check the final code, [take a look at the completed code!](https://github.com/matthewcn56/qwerhacks-22-firebase-workshop/tree/main/main-workshop/completed)!

And for the entire site in all its glory, check it out [here](https://qwerhacks-22-firebase-demo.netlify.app/)!

## Conclusion and Next Steps

Congratulations! Together, we converted our client-only to-do list to one that uses Firestore completely, and works with multiple users! In particular, we covered quite a bit:

- creating and importing a Firebase project with Firestore
- understanding Firestore's data structures (collections)
- simple Create, Read, Update, and Delete operations (with `.set()`, `.get()`, `.update()`, and `.delete()` respectively)
- using `.onSnapshot()` as a listener
- batching operations with `.batch()`
- querying data with `.where()`

This should give you a great foundation to start using Firestore on your project too!

There's much more you can do with Firestore. Some things that we didn't get to cover in this workshop:

- [ordering and limiting data](https://firebase.google.com/docs/firestore/query-data/order-limit-data)
- [paginating (splitting up) data reads](https://firebase.google.com/docs/firestore/query-data/query-cursors)
- [persistent offline data](https://firebase.google.com/docs/firestore/manage-data/enable-offline)
- secure data access with [Firestore security rules](https://firebase.google.com/docs/firestore/security/get-started)

Firebase also has many other useful solutions for hackathon projects! Some convenient ones include:

- [Firebase Authentication](https://firebase.google.com/docs/auth/web/start), to manage user account creation, log in, and SSO with other services (Google, Facebook, Apple, etc.)
- [Firebase Hosting](https://firebase.google.com/docs/hosting/quickstart) to deploy and host your project!
- [Firebase CLoud Functions](https://firebase.google.com/docs/functions/get-started), a lambda-like utility that lets you create small backend-like functionality without deploying a backend!

We hope you found this tutorial helpful! If you're still confused, have any questions, or want to learn more, the mentors at QWER Hacks are your resource! I (Matt) will be around, as well as many other qualified and super friendly mentors. Feel free to reach out to us and say hi, we'd love to help!!

Good luck hacking, we know you're going to kill it :)

## Licensing, Attribution, and Resources

[Matt Wang](https://matthewwang.me) has taught some variant of this workshop (among other React-related ones) several times before; past iterations include:

- [QWER Hacks 2020's Intro to Web Dev with React and Firebase](https://github.com/mattxwang/qwerhacks-web-dev-workshop)
- [Learning Lab Crash Course: Intro to Firebase](https://github.com/uclaacm/learning-lab-crash-course-su20/tree/master/18-firebase)

He's also got a few favourite external sources, including:

- [the official Firestore docs](https://firebase.google.com/docs/firestore)
- Reed Barger's [Firestore Tutorial](https://www.freecodecamp.org/news/the-firestore-tutorial-for-2020-learn-by-example/) on freeCodeCamp

The contents of the workshop this is based off of made by Matt Wang are dual-licensed under the [MIT License](https://github.com/mattxwang/qwerhacks-21-workshops/blob/main/LICENSE) and the [Creative Commons Attribution 4.0 License](https://creativecommons.org/licenses/by/4.0/); feel free to use whichever license suits your purpose better.

If you have any feedback or suggestions on how to make this workshop better, you can message either me, Matt Nieva at [matthewcn56@gmail.com](mailto:matthewcn56@gmail.com) or to the original workshop content creator, Matt Wang, at [matt@matthewwang.me](mailto:matt@matthewwang.me).
