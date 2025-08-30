

const secciones = {
  home: {
    file: '/partials/home.html',
  },
  usuarios: {
    file: '/partials/usuarios.html',

  },
  cines: {
    file: '/partials/cines.html',
  },
  salas: {
    file: '/partials/salas.html',
  },
  peliculas: {
    file: '/partials/peliculas.html',
  },
  funciones: {
    file: '/partials/funciones.html',
  }
};



// funcion para poder generar el token
function isTokenExpired(token) {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (err) {
    return true;
  }
}



// home primero
async function cargarSeccionInicial() {
  const config = secciones['home'];
  if (!config) return;

  try {
    const response = await fetch(config.file);
    const html = await response.text();
    document.getElementById('main-content').innerHTML = html;
  } catch (err) {
    document.getElementById('main-content').innerHTML = '<p>Error al cargar la sección de inicio.</p>';
  }
}


window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  if (!token || isTokenExpired(token)) {
    alert('Sesión expirada. Vuelve a iniciar sesión.');
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  cargarSeccionInicial();
  const container = document.getElementById('main-content');

  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', async () => {
      const section = item.getAttribute('data-section');
      const config = secciones[section];
      if (!config) return alert('Sección no configurada');
      try {
        const response = await fetch(config.file);
        const html = await response.text();
        container.innerHTML = html;
        if (section === 'usuarios') {
          const script = document.createElement('script');
          script.src = '/src/js/usuarios.js';
          document.body.appendChild(script);
        } else if (section === 'cines') {
          const scriptCines = document.createElement('script');
          scriptCines.src = '/src/js/cines.js';
          scriptCines.onload = () => {
            if (typeof cargarCines === 'function') {
              cargarCines();
            }
          };
          document.body.appendChild(scriptCines);
        }else if(section === 'salas'){
          const script = document.createElement('script');
          script.src = '/src/js/salas.js';
          script.onload = () =>{
            if(typeof initSalas() === 'function'){
              initSalas();
            }
          }
          document.body.appendChild(script);
        }else if(section === 'peliculas'){
          const script = document.createElement('script');
          script.src = '/src/js/peliculas.js';
          script.onload = () =>{
            if(typeof initPeliculas() === 'function'){
              initPeliculas();
            }
          }
          document.body.appendChild(script);
        }
      } catch (err) {
        container.innerHTML = '<p>Error al cargar la sección.</p>';
      }
    });
  });
});





