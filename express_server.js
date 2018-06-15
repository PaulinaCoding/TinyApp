const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


const bcrypt = require('bcrypt');
// const password = "purple-monkey-dinosaur"; // you will probably this from req.params
// const hashedPassword = bcrypt.hashSync(password, 10);


//Adding middleware to convert data into JS objects inside our functions
app.use(bodyParser.urlencoded({extended: true})); //forms
app.use(cookieParser());

app.set("view engine", "ejs");

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
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
 "RandomId2": {
    id: "RandomId2", 
    email: "user2@example.com", 
    password: bcrypt.hashSync("dishwasher-funk", 10)
  },
  "RandomId3": {
    id: "RandomId2", 
    email: "paulinate@o2.pl", 
    password: bcrypt.hashSync("123", 10)
  }
};


//////Exercise examples/////////////////
//displaying urlDatabase as json object on the website
app.get("/", (request, response) => {
  response.end("Hello!This is a TinyApp!");
});

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase);
});

//Sending html
app.get("/hello", (request, response) => {
  response.end("<html><body>Hello <b>World</b></body></html>\n");
});

////////////GET METHODS/////////////////

app.get("/urls", (request, response) => {
  const userID = request.cookies["user_id"];
  if (userID){
    let templateVars = { 
      user: users[userID],
      urls: getUrlsOfUser(userID) //urlDatabase 
    };
    response.render("urls_index", templateVars);
  } else {
    response.redirect("/login");
  }
});

app.get("/urls/new", (request, response) => {
  const userID = request.cookies["user_id"];
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
  const userID = request.cookies["user_id"];
  let templateVars = { 
    shortURL: request.params.id, 
    urls: getUrlsOfUser(userID),
    user: users[userID].email
  };
  response.render("urls_show", templateVars);
});

app.get("/urls/:id/update", (request, response) => {
  const userID = request.cookies["user_id"];
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
  const userID = request.cookies["user_id"];
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
    userID: request.cookies["user_id"]
  }
  
  urlDatabase[shortURL] = newUrl;
  response.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (request, response) => {
  const shortURL = request.params.shortURL
  const userID = request.cookies["user_id"];
  if (userID){
    delete urlDatabase[shortURL];
    response.redirect("/urls");
  }
  else {
    response.redirect("/login");
  }
});

app.post("/urls/:id/update", (request, response) => {
  const userID = request.cookies["user_id"];
  if (userID){
    urlDatabase[request.params.id].urls = request.body.longURL;
    response.redirect("/urls");
  }
  else {
    response.redirect("/login");
  }

});

//This is logout route which also clears the cookie
app.post("/logout", (request, response) => {
  response.clearCookie("user_id");
  response.redirect("/urls");
});

app.post("/register", (request, response) => {
  let userID = generateRandomString();
  let email = request.body.email;
  let password = request.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (email && password){
    if (doesEmailExists (email)){
      response.status(400).send('<html><body><b><h1>Error 400!</h1><br><h2>User already exists!</h2></b></body></html>');
    } else {
      users[userID] = {
        id : userID,
        email: email,
        password: password
      } 
      response.cookie( "user_id", userID);
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
  if (user) {
    if (user.password === password) {
      response.cookie( "user_id", user.id);
      response.redirect("/urls");
    }
    return response.status(403).send('Error 403! Wrong password!');
  }
  else {
    return response.status(403).send('Error 403! Wrong email!');
  }
});
///////////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

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

  function getUrlsOfUser(userID){
    const userURLs = {};
    for (let short in urlDatabase){
      if (urlDatabase[short].userID === userID){
        userURLs[short] = urlDatabase[short];
      }
    }
    return userURLs;
  }
  //Function generating a random string of 6 digits
  function generateRandomString() {
  let randomStr = "";
  const items = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 6; i++)
    randomStr += items.charAt(Math.floor(Math.random() * items.length));
    return randomStr;
}
