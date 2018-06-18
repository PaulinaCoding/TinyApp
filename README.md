# Tiny App Project

A full stack web app build with Node and Express that allows users to shorten long URLS much like TinyURL.com and bit.ly do.


## Dependencies

- Node.js 8.9.4
- Express 4.16.3
- EJS -2.6.1
- Body-parser 1.18.3
- Nodemon 1.17.5
- Bcryptjs 2.4.3 
- Cookie-session 2.0.0-beta.3


## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js`command if you want to restart server every time. Faster and most convenient option is `nodemon express_server.js`command which restart server every time when you save the server file (Ctrl+C for Linux/ Windows and Cmd+C for Mac). If you are using Vagrant please make sure to use following version of nodemone command, otherwise it won't be working: `nodemon -L express_server.js`.
- Bcrypt was causing troubles during installation with `npm install` that's why was replaced with more stable Bcryptjs.

## Final Product

!['/urls - the main page'](https://github.com/PaulinaCoding/TinyApp/blob/master/docs/main-page.png)
!['New page shortening urls'](https://github.com/PaulinaCoding/TinyApp/blob/master/docs/new-url-page.png) 
!['Main page with added new url'](https://github.com/PaulinaCoding/TinyApp/blob/master/docs/main-page-with%20added-newurl.png)
!['Edit url page'](https://github.com/PaulinaCoding/TinyApp/blob/master/docs/editurl-page.png) 
!['Registration page'](https://github.com/PaulinaCoding/TinyApp/blob/master/docs/register-page.png) 
!['Login page'](https://github.com/PaulinaCoding/TinyApp/blob/master/docs/login-page.png) 
