const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userwithsamename = users.filter((user)=>{
    return user.username === username;
  })
  if (userwithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message : "Please input username and password"});
  }

  if (authenticatedUser(username,password)){
    // let accessToken = jwt.sign({data: password},'access',{expiresIn: 60*60})
    let accessToken = jwt.sign({data: password},'access',{expiresIn: 60*60})
    req.session.authorization = {accessToken,username}
    // console.log(accessToken)
    console.log(req.session.authorization)
    return res.status(200).json({message : "Login sucessfully"});
  } else {
    return res.status(208).json({message: "Invalid Login. Please check username and password"})
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let username = req.session.authorization["username"]
  let isbn = req.params.isbn
  let review = books[isbn].reviews[username]
  let newReview = req.body.review

  if (!review) {
    // cannot update
    let review = books[isbn].reviews[username]
    review = newReview
    return res.send({message:"Already create review.",reviews:review})
  } else {
    review = newReview
    return res.send({message:"Already updated review.",reviews:review})
  }
});


regd_users.put("/auth/review2/:isbn", (req, res) => {
  // Extract username from session
  const username = req.session.authorization.username;

  // Extract ISBN and new review from request
  const isbn = req.params.isbn;
  const newReview = req.body.review;

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).send({ message: "Book not found." });
  }

  // Check if the user has already reviewed the book
  if (books[isbn].reviews[username]) {
    // Update existing review
    books[isbn].reviews[username] = newReview;
    return res.send({ message: "Review updated successfully.", reviews: books[isbn].reviews[username] });
  } else {
    // Create a new review
    books[isbn].reviews[username] = newReview;
    return res.send({ message: "Review created successfully.", reviews: books[isbn].reviews[username] });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

//https://author-ide.skills.network/render?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZF9pbnN0cnVjdGlvbnNfdXJsIjoiaHR0cHM6Ly9jZi1jb3Vyc2VzLWRhdGEuczMudXMuY2xvdWQtb2JqZWN0LXN0b3JhZ2UuYXBwZG9tYWluLmNsb3VkL0lCTURldmVsb3BlclNraWxsc05ldHdvcmstQ0QwMjIwRU4tU2tpbGxzTmV0d29yay9sYWJzJTJGTW9kdWxlM19FeHByZXNzSlMlMkZNb2R1bGUzX0V4cHJlc3NKU19IYW5kc09uX0xhYl9FeHByZXNzU2VydmVyLm1kIiwidG9vbF90eXBlIjoidGhlaWEiLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTcxMTQyNjU0MX0.X3eOhRSkR0u-Dbngenxd4AmzUX6PxXMdkK25_Cm6bl0