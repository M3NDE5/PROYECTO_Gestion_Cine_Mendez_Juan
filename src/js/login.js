document.querySelector('#btnIngreso').addEventListener('click', async () => {
  const email = document.querySelector('#inputText').value;
  const password = document.querySelector('#inputPass').value;

  try {
    const response = await fetch('/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || 'Error de autenticación');
      return;
    }

    
    localStorage.setItem('token', data.token);

    
    window.location.href = '/dashboard';
  } catch (err) {
    alert('Error al conectar con el servidor');
    console.error(err);
  }
});




