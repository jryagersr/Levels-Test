
module.exports = function (app) {
var auth = require("../controllers/AuthController.js");

// restrict index for logged in user only
app.get('/', auth.home);

// route to register page
app.get('/register', auth.register);

// route for register action
app.post('/register', auth.doRegister);

// route to login page
app.get('/login', auth.login);

// route for login action
app.post('/login', auth.doLogin);

// route for logout action
app.get('/logout', auth.logout);

  
}; // End of module.exports