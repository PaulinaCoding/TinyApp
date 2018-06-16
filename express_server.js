const express = require("express");
const app = express();
const PORT = 8080;

////Middlewares///////////////////////////////
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');

app.use(cookieSession({
  name: 'session',
  keys: ["testkey1", "testkey2"]
}));
app.use(bodyParser.urlencoded({extended: true})); 
app.set("view engine", "ejs");


//////Helper Functions//////////////////////

// Handling register 
  function doesEmailExists(email){
    for ( let user in users){
      if( users[user].email === email){
        return true;
      }
    }
  };
  
  //Handling the Login
function getUserByEmail(email){
  for ( let user in users){
    if( users[user].email === email){
      return users[user];
    }
  }
  return null;
};
// Handling the 
function getUrlsOfUser(userID){
  const userURLs = {};
  for (let short in urlDatabase){
    if (urlDatabase[short].userID === userID){
      userURLs[short] = urlDatabase[short];
    }
  }
  return userURLs;
};
  //Function generating a random string of 6 digits for short urls
function generateRandomString() {
let randomStr = "";
const items = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

for (let i = 0; i < 6; i++)
  randomStr += items.charAt(Math.floor(Math.random() * items.length));
  return randomStr;
};

/////////////Databases//////////////////////

let urlDatabase = {
  "b2xVn2": {
    url: "http://www.lighthouselabs.ca",
    userID: "RandomId1"
   },
  "9sm5xK": {
    url: "http://www.google.com",
    userID: "RandomId2"
  }
};

let users = { 
  "RandomId1": {
    id: "RandomId1", 
    email: "user1@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "RandomId2": {
    id: "RandomId2", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  },
  "RandomId3": {
    id: "RandomId3", 
    email: "paulinate@o2.pl", 
    password: "12"
  }
};

////////////GET METHODS/////////////////
app.get("/urls", (request, response) => {
  const userID = request.session["user_id"];
  if (userID){
    let templateVars = {
      user: users[userID],
      urls: getUrlsOfUser(userID) //replaced urlDatabase
    };
    response.render("urls_index", templateVars);
  } else {
    response.redirect("/login");
  }
});

app.get("/urls/new", (request, response) => {
  const userID = request.session["user_id"];
  let templateVars = {
    user: users[userID]
  };
  if (userID === undefined){
    response.redirect("/login")
  } else {
  response.render("urls_new", templateVars);
  }
});

app.get("/urls/:id", (request, response) => {
  const userID = request.session["user_id"];
  let templateVars = {
    shortURL: request.params.id,
    urls: getUrlsOfUser(userID),
    user: users[userID].email
  };
  response.render("urls_show", templateVars);
});

app.get("/urls/:id/edit", (request, response) => {
  const userID = request.session["user_id"];
  let templateVars = { 
    shortURL: request.params.id,
    urls: getUrlsOfUser(userID),
    user: users[userID].email
  };
  if (userID){
    response.render("urls_show", templateVars);
  }
  else {
    response.redirect("/login");
  }
});

app.get("/u/:shortURL", (request, response) => {
  let longURL = urlDatabase[request.params.shortURL].url;

  response.redirect(longURL);
});

app.get("/register", (request, response) => {
  response.render("register");
});

app.get("/login", (request, response) => {
  const userID = request.session["user_id"];
  let templateVars = {
    user: users[userID]
  };
  response.render("login", templateVars);
});

////////////POST METHODS/////////////////

app.post("/urls", (request, response) => {
  const shortURL = generateRandomString();
  const longURL = request.body.longURL;
 
  let newUrl = {
    url: longURL,
    userID: request.session["user_id"]
  }
  
  urlDatabase[shortURL] = newUrl;
  response.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (request, response) => {
  const shortURL = request.params.shortURL
  const userID = request.session["user_id"];
  if (userID){
    delete urlDatabase[shortURL];
    response.redirect("/urls");
  }
  else {
    response.redirect("/login");
  }
});

app.post("/urls/:id/edit", (request, response) => {
  const userID = request.session["user_id"];
  if (userID){
    urlDatabase[request.params.id].urls = request.body.longURL;
    response.redirect("/urls");
  }
  else {
    response.redirect("/login");
  }
});

app.post("/logout", (request, response) => {
  request.session = null;
  response.redirect("/urls");
});

app.post("/register", (request, response) => {
  let userID = generateRandomString();
  let email = request.body.email;
  let password = request.body.password;

  const saltRounds = 13;
  const hashed = bcrypt.hashSync(password, saltRounds);
  console.log("Return true if the  password gets encrypted durin registration:",bcrypt.compareSync(password, hashed));

  if (email && password){
    if (doesEmailExists (email)){
      response.status(400).send('<html><body><b><h1>Error 400!</h1><br><h2>User already exists!</h2></b></body></html>');
    } else {
      users[userID] = {
        id : userID,
        email: email,
        password: hashed
      } 
      request.session.user_id = userID;
      response.redirect("/urls");
    }
  }
  else {
    response.status(400).send('Error 400! No email or/and password provides!');
  }
});

app.post("/login", (request, response) => {
  let {email, password} = request.body;
  const user = getUserByEmail(email);
  const saltRounds = 13;
  const hashed = bcrypt.hashSync(password, saltRounds);
  console.log("Return true if the Login password has been encrypted:",bcrypt.compareSync(password, hashed));
  if (user) {
    if (user.password === password) {
      request.session.user_id = user.id;
      response.redirect("/urls");
    } else {
    return response.status(403).send('<html><body><b><h1>Error 403!</h1><br><h2>Wrong password or no password provided!</h2></b></body></html>');
    
    }
  } else {
    return response.status(403).send('<html><body><b><h1>Error 403!</h1><br><h2>Wrong email or no email provided!</h2></b></body></html>');
  }
});


//////////////PORT ////////////////////

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

