const resetForm = document.querySelector('.resetForm');
const resetButton = resetForm.querySelector('button');
const feedback = document.querySelector('.feedback');
const email = document.querySelector('.email').textContent;

resetButton.addEventListener('click', (event) => {
    event.preventDefault();

    const otpInput = resetForm.querySelector('input[name="otp"]');
    const passwordInput = resetForm.querySelector('input[name="password"]');

    const otp = otpInput.value;
    const password = passwordInput.value;

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            otp: otp,
            password: password
        })
    };

    fetch('/resetPassword', requestOptions)
        .then(response => {
            if(response.ok){
                console.log('Password reset successfully');  
                feedback.textContent = 'Password reset successfully. Redirecting to login page....'
                window.location.href = `/`;
            } else{
                feedback.textContent = 'The OTP entered is wrong';
            }
        })
        .catch(error => {
            console.log(error);
        })
})