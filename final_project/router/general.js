const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!(username || password))
    return res.status(300).send({error: `username or password are not provided`});
  
  if (isValid(username))
    return res.status(300).send({error: `Username is already exits`});
  // for (const key in users) {
  //   if (users[key].username === username){
  //     return res.status(300).send({error: `Username is already exits`});
  //   }
  // }
  users.push({username : username , password : password});
  console.log(users)
  return res.status(200).send({message:`User ${username} has been added.`});
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const book = books[isbn]
  if (book) {
    res.json(book);
  } else {
    res.status(300).send({error: 'Book not found'});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const authorName = req.params.author.toLowerCase()
  const results = [];

  for (const key in books) {
    if (books[key].author.toLowerCase().includes(authorName)) {
      results.push(books[key]);
    }
  }
  
  if (results.length > 0) {
    return res.json(results);
  } else {
    return res.status(404).json({ message: 'No book found by author name' + req.params.author + '.'})
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const titleName = req.params.title.toLowerCase();
  const results = [];

  for (const key in books) {
    if (books[key].title.toLowerCase().includes(titleName)){
      results.push(books[key]);
    }
  }

  if(results.length > 0) {
    return res.json(results);
  } else {
    return res.status(404).json({ message: 'No book found by title' + req.params.title + '.'});
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: 'No book review by isbn' + req.params.isbn + '.'});
  }

});

module.exports.general = public_users;
