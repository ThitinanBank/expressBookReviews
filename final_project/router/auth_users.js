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
    let accessToken = jwt.sign({data: password},'access',{expiresIn: 60*60})
    req.session.authorization = {accessToken,username}
    return res.status(200).json({message : "Login sucessfully"});
  } else {
    return res.status(208).json({message: "Invalid Login. Please check username and password"})
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

//https://author-ide.skills.network/render?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZF9pbnN0cnVjdGlvbnNfdXJsIjoiaHR0cHM6Ly9jZi1jb3Vyc2VzLWRhdGEuczMudXMuY2xvdWQtb2JqZWN0LXN0b3JhZ2UuYXBwZG9tYWluLmNsb3VkL0lCTURldmVsb3BlclNraWxsc05ldHdvcmstQ0QwMjIwRU4tU2tpbGxzTmV0d29yay9sYWJzJTJGTW9kdWxlM19FeHByZXNzSlMlMkZNb2R1bGUzX0V4cHJlc3NKU19IYW5kc09uX0xhYl9FeHByZXNzU2VydmVyLm1kIiwidG9vbF90eXBlIjoidGhlaWEiLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTcxMTQyNjU0MX0.X3eOhRSkR0u-Dbngenxd4AmzUX6PxXMdkK25_Cm6bl0