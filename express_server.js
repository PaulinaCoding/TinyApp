const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');


//Adding middleware to convert data into JS objects inside our functions
app.use(bodyParser.urlencoded({extended: true})); //forms
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


//////Exercise examples/////////////////
//displaying urlDatabase as json object on the website
app.get("/", (request, response) => {
  response.end("Hello World!");
});

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase);
});

//Sending html
app.get("/hello", (request, response) => {
  response.end("<html><body>Hello <b>World</b></body></html>\n");
});


/////////////////////////////////////////


////////////GET  METHODS/////////////////

app.get("/urls", (request, response) => {
  let templateVars = { 
    username: request.cookies["username"],
    urls: urlDatabase 
  };
  response.render("urls_index", templateVars);
});

app.get("/urls/new", (request, response) => {
  response.render("urls_new");
});

app.get("/urls/:id", (request, response) => {
  let templateVars = { 
    shortURL: request.params.id, 
    urls: urlDatabase,
    username: request.cookies["username"]
  };
  response.render("urls_show", templateVars);
});

app.get("/urls/:id/update", (request, response) => {
  let templateVars = { 
    shortURL: request.params.id, 
    urls: urlDatabase,
    username: request.cookies["username"]
  };
  response.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (request, response) => {
  const longURL = urlDatabase[request.params.shortURL];
  response.redirect(longURL);
});

////////////POST METHODS/////////////////
app.post("/urls", (request, response) => {
  const shortURL = generateRandomString();
  const longURL = request.body.longURL;
  urlDatabase[shortURL] = longURL;
  response.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (request, response) => {
  const shortURL = request.params.shortURL
  delete urlDatabase[shortURL]
  //console.log(request.params.shortURL)
  response.redirect("/urls");
});

app.post("/urls/:id/update", (request, response) => {
  urlDatabase[request.params.id] = request.body.longURL;
  response.redirect("/urls");
});

app.post("/login", (request, response) => {
  let username = request.body.username;
  response.cookie( "username", username);
  response.redirect("/urls");
});

//This is logout route which also clears the cookie
app.post("/logout", (request, response) => {
  response.clearCookie("username");
  response.redirect("/urls");
});


///////////////////////////////////////////////
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});

function generateRandomString() {
  let randomStr = "";
  const items = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 6; i++)
    randomStr += items.charAt(Math.floor(Math.random() * items.length));
  return randomStr;
}
