const signUpForm = document.querySelector('.sign-up-form');
const signUpButton = signUpForm.querySelector('button');
const feedback = document.querySelector('.feedback');

signUpButton.addEventListener('click', (event) => {
    event.preventDefault();

    const emailInput = signUpForm.querySelector('input[name="email"]');
    const usernameInput = signUpForm.querySelector('input[name="username"]');
    const passwordInput = signUpForm.querySelector('input[name="password"]');

    const data = {
        email: emailInput.value,
        username: usernameInput.value,
        password: passwordInput.value
    };

    fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            console.log(response);
            if (response.ok) {
                feedback.textContent = "User Created. Redirecting to login page..."
                window.location.href = "/";
            } else {
                feedback.textContent = "Username or Email already taken"
            }
        })
        .catch(error => {
            console.error('Error creating user', error);
            if (error.code === 11000) {
                feedback.textContent = "Username or email already taken";
            } else {
                feedback.textContent = "Error creating user";
            }

        });
});
