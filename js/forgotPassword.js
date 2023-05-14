const passForm = document.querySelector('.passForm');
const OTPbutton = passForm.querySelector('button');
console.log(OTPbutton);

OTPbutton.addEventListener('click', (event) => {
  event.preventDefault();
  
  const emailInput = passForm.querySelector('input[name="email"]');
  const email = emailInput.value;

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      subject: 'OTP to reset Crunch Password',
      message: 'Your OTP to reset Crunch password is'
    })
  };

  fetch('/sendOTP', requestOptions)
    .then(response => {
      if (response.ok) {
        console.log('OTP sent to the email successfully');  
        window.location.href = `/otpVerification/${email}`;
      } else {
        console.log('Error sending OTP email');        
      }
    })
    .catch(error => {
      console.log(error);  
    });
});
