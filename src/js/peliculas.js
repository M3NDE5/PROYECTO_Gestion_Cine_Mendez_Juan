

function abrirModal(id) {
  document.getElementById(id).style.display = 'flex';
}

function cerrarModal(id) {
  document.getElementById(id).style.display = 'none';
}



window.crearPelicula = function () {
  const pelicula = {
    codigo: document.getElementById('crearCodigo').value,
    titulo: document.getElementById('crearTitulo').value,
    sinopsis: document.getElementById('crearSinopsis').value,
    poster: document.getElementById('crearPoster').value,
    trailer: document.getElementById('crearTrailer').value,
    reparto: document.getElementById('crearReparto').value,
    clasificacion: document.getElementById('crearClasificacion').value,
    idioma: document.getElementById('crearIdioma').value,
    director: document.getElementById('crearDirector').value,
    duracion: document.getElementById('crearDuracion').value,
    genero: document.getElementById('crearGenero').value,
    fechaEstreno: document.getElementById('crearFechaEstreno').value,
  };

  fetch('/peliculas/crearPelicula', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pelicula)
  })
    .then(res => {
      if (!res.ok) throw new Error('Error al crear película');
      return res.json();
    })
    .then(peliculaCreada => {
      alert('Película creada con éxito');
      cerrarModal('modalCrear');
      renderizarPelicula(pelicula); 
    })
    .catch(err => alert('Error: ' + err.message));
};


window.eliminar = function() {
  const codigo = document.getElementById('codEliminar').value;

  fetch('/peliculas/eliminarPelicula', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codigo })
  })
    .then(res => {
      if (!res.ok) throw new Error('Error al eliminar película');
      return res.json();
    })
    .then(() => {
      alert('Película eliminada con éxito');
      cerrarModal('modalEliminar');

      // ⬇️ Elimina del DOM la tarjeta correspondiente
      const divPelicula = document.getElementById(`pelicula-${codigo}`);
      if (divPelicula) divPelicula.remove();
    })
    .catch(err => alert('Error: ' + err.message));
}



function renderizarPelicula(pelicula) {
  const contenedor = document.getElementById('contenedorPeliculas');

  const div = document.createElement('div');
  div.classList.add('pelicula-container');
  div.id = `pelicula-${pelicula.codigo}`; // <--- IMPORTANTE para poder eliminarlo después

  div.innerHTML = `
    <img src="${pelicula.poster}" class="poster" alt="Poster Película">
    <div class="detalles">
      <p><strong>Título:</strong> ${pelicula.titulo}</p>
      <p><strong>Sinopsis:</strong> ${pelicula.sinopsis}</p>
    </div>
  `;

  contenedor.appendChild(div);
}




function cargarPeliculasExistentes() {
  fetch('/peliculas/obtenerPeliculas')
    .then(res => res.json())
    .then(peliculas => {
      const contenedor = document.getElementById('contenedorPeliculas');
      contenedor.innerHTML = ''; // Limpiar contenido previo
      peliculas.forEach(renderizarPelicula);
    })
    .catch(err => {
      console.error('Error al cargar películas:', err);
      alert('Error al cargar las películas existentes');
    });
}


function initPeliculas() {
  cargarPeliculasExistentes();
}



// Actualizar la película
function actualizarPelicula() {
  const pelicula = {
    codigo: document.getElementById('actualizarCodigo').value,
    titulo: document.getElementById('actualizarTitulo').value,
    sinopsis: document.getElementById('actualizarSinopsis').value,
    poster: document.getElementById('actualizarPoster').value,
    trailer: document.getElementById('actualizarTrailer').value,
    reparto: document.getElementById('actualizarReparto').value,
    clasificacion: document.getElementById('actualizarClasificacion').value,
    idioma: document.getElementById('actualizarIdioma').value,
    director: document.getElementById('actualizarDirector').value,
    duracion: document.getElementById('actualizarDuracion').value,
    genero: document.getElementById('actualizarGenero').value,
    fechaEstreno: document.getElementById('actualizarFechaEstreno').value,
  };

  fetch('/peliculas/actualizarPelicula', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pelicula)
  })
    .then(res => {
      if (!res.ok) throw new Error('Error al actualizar la película');
      return res.json(); // Se espera respuesta JSON
    })
    .then(data => {
      alert('Película actualizada con éxito');
      cerrarModal('modalActualizar');
      
      // Actualizar el DOM con la nueva información
      const divPelicula = document.getElementById(`pelicula-${pelicula.codigo}`);
      if (divPelicula) {
        divPelicula.querySelector('.poster').src = pelicula.poster;
        divPelicula.querySelector('.detalles').innerHTML = `
          <p><strong>Título:</strong> ${pelicula.titulo}</p>
          <p><strong>Sinopsis:</strong> ${pelicula.sinopsis}</p>
        `;
      }
    })
    .catch(err => alert('Error: ' + err.message));
}


