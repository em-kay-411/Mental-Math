const signUpForm = document.querySelector('.sign-up-form');
const signUpButton = signUpForm.querySelector('button');

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
    if (response.ok) {
      alert('User created successfully');
      window.location.href="/";
    } else {
      alert('Error creating user');
    }
  })
  .catch(error => {
    console.error('Error creating user', error);
    alert('Error creating user');
  });
});
