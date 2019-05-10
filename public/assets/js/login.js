
let formContent = [
    `<h2>Register</h2>
    <form onsubmit='validateAndSubmitForm("register", event)'>
    <div>
        <label>Name:</label>
        <input id='name' type="text" name="name"/>
    </div>
    <div>
        <label>Email:</label>
        <input id='username' type="text" name="username"/>
    </div>
    <div>
        <label>Password:</label>
        <input id='password' type="password" name="password"/>
    </div>
    <div>
        <span id='validationMsg'></span>
        <input type="submit" value="Register"/>
    </div>
    </form>
    <p>Already have an account?</p>`,

    `<h2>Log In</h2>
    <form onsubmit='validateAndSubmitForm("login", event)'>
        <div>
            <label>Username:</label>
            <input id='username' type="text" name="username"/>
        </div>
        <div>
            <label>Password:</label>
            <input id='password' type="password" name="password"/>
        </div>
        <div>
            <span id='validationMsg'></span>
            <input type="submit" value="Log In"/>
        </div>
    </form>
    <p>Don't have an account?</p>`,
]
let i = 0;
$('#switch').on("click", function () {
    $('#formWell').empty();
    $("#switch").empty();
    $('#formWell').html(formContent[i])
    if (i == 0) {
        i = 1;
        $("#switch").html('Log in');
    }
    else {
        i = 0;
        $("#switch").html('Register');
    }
})

function validateAndSubmitForm(type) {
    event.preventDefault();
    console.log(type);

    // if submit is register event
    if (type == 'register') {
        let name = document.getElementById('name').value;
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        // Conditions
        if (name != '' && username != '' && password != '') {
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
            } else {
                $('#validationMsg').html("Email address is invalid.");
                return false;
            }
        } else {
            $('#validationMsg').html("All fields are required.");
            return false;
        }


        let data = {
            name: name,
            username: username,
            password: password
        }
        makePost("/register", "POST", data, "Registered");
    }

    // if submit is login event
    else if (type == 'login') {
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        // Conditions
        if (username != '' && password != '') {
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
            } else {
                $('#validationMsg').html("Email address is invalid.");
                return false;
            }
        } else {
            $('#validationMsg').html("All fields are required.");
            return false;
        }

        let data = {
            username: username,
            password: password
        }
        makePost("/login", "POST", data, "Logged in");
    }
}

function makePost(url, method, data, string) {
$.ajax({
    url: url,
    method: method,
    data: (data)
}).then(function(data, err) {
    if (typeof data.message !== 'undefined') {
        $('#loginMsg').html(data.message);
    } else {
        $('#loginMsg').html(`${string} successfully. You will be redirected in a few moments.`)
        setTimeout(function(){ 
            window.location.reload();
        }, 5000);
    }
})

}
