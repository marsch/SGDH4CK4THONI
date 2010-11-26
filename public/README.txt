//Unified Middleware for Communication Center - Server
//here applications can be published, users can add and authorize the apps
//and do the configuration stuff per application, rules, etc.
//node.js is used to ensure scalability
//express is used because its a web app, with oauth implementation


/**
* 
* GET /
* Guides to the User-Home if she is authenticated,
* else the Login-Page is displayed
* 
* 
* GET /user
* Render UserHome
* 
* 
* POST /user/login
* {username:,password:,auth_token:}
* User login in
* 
* 
* GET /user/logout 
* User Session gets inalidated
* 
* 
* GET /user/home
* Go to the home screen of the user
* 
* 
* GET /user/apps
* get installed apps
* 
* 
* GET /user/apps/[APP_ID]/config
* Enter the application Config page
* 
* 
* GET /apps/directory
* 
* 
* ///LOOOK AT AUTH SAMPLE OF EXPRESS FRAMEWORK, AGAIN... 
* LOOK AT THE OAUTH EXAMPLE ... better to implement OAUTH2.
*/