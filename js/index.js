const signInForm = document.querySelector('.sign-in-form');
const signInButton = signInForm.querySelector('button');
const feedback = document.querySelector('.feedback');

signInButton.addEventListener('click', (event) => {
    event.preventDefault();

    const usernameInput = signInForm.querySelector('input[name="username"]');
    const passwordInput = signInForm.querySelector('input[name="password"]');

    const data = {
        username: usernameInput.value,
        password: passwordInput.value
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        console.log(response);
        if (response.ok) {
            feedback.textContent = "Authenticated Successfully... Redirecting..."
            window.location.href = "/settings";
        } else {
            feedback.textContent = "Wrong username or password"
        }
    })
    .catch(error => {
        console.error('Error creating user', error);
        feedback.textContent = "Error logging in";

    });

});
