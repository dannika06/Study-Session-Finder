const form = document.getElementById('login-form');
const message = document.getElementById('login-message');
const registerBtn = document.getElementById('register-btn');

async function sendAuth(url) {
  message.textContent = '';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: form.username.value.trim(),
        password: form.password.value,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      message.textContent = data.error;
      return;
    }
    window.location.href = '/';   // success: go to the main page
  } catch (err) {
    message.textContent = 'Could not reach the server.';
  }
}

// "Log in" button (form submit)
form.addEventListener('submit', (event) => {
  event.preventDefault();
  sendAuth('/api/login');
});

// "Create account" button
registerBtn.addEventListener('click', () => {
  if (!form.reportValidity()) return;   // shows the "required" warnings
  sendAuth('/api/register');
});