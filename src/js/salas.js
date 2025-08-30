// ================== UTILIDADES ==================

function cargarCinesEnSelect(ids = []) {
  fetch('/cines/obtener')
    .then(res => res.json())
    .then(cines => {
      ids.forEach(id => {
        const select = document.getElementById(id);
        if (!select) {
          console.warn(`No se encontró el select con ID "${id}"`);
          return;
        }

        select.innerHTML = '<option disabled selected>Seleccione un cine</option>';
        cines.forEach(cine => {
          const option = document.createElement('option');
          option.value = cine.codigo;
          option.textContent = `${cine.nombreCine} (${cine.codigo})`;
          select.appendChild(option);
        });
      });
    })
    .catch(err => {
      console.error('Error al cargar cines:', err);
      alert('Error al cargar la lista de cines');
    });
}

function renderizarSala(sala) {
  const contenedor = document.getElementById('listaSalas');

  const card = document.createElement('div');
  card.classList.add('sala-card');

  card.innerHTML = `
    <h3>${sala.nombreSala}</h3>
    <p><strong>Código:</strong> ${sala.codigoSala}</p>
    <p><strong>Número de sillas:</strong> ${sala.numSillas}</p>
    <p><strong>Cine:</strong> ${sala.cine.nombreCine} (${sala.cine.codigo})</p>
  `;

  contenedor.appendChild(card);
}

function cargarSalasExistentes() {
  fetch('/salas/obtener')
    .then(res => res.json())
    .then(salas => {
      const contenedor = document.getElementById('listaSalas');
      contenedor.innerHTML = '';
      salas.forEach(sala => renderizarSala(sala));
    })
    .catch(err => {
      console.error('Error al cargar salas:', err);
      alert('Error al cargar salas existentes');
    });
}

function initSalas() {
  cargarSalasExistentes();
}

// ================== CREAR SALA ==================

function crearSala() {
  const codigoSala = document.getElementById('codigoSala').value.trim();
  const nombreSala = document.getElementById('nombreSala').value.trim();
  const numSillas = parseInt(document.getElementById('numSillas').value);
  const codigoCine = document.getElementById('cineAsociadoSelect').value;

  if (!codigoSala || !nombreSala || isNaN(numSillas) || !codigoCine) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  fetch('/salas/crear', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codigoSala, nombreSala, numSillas, codigoCine })
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al ingresar la sala");
      return res.text();
    })
    .then(data => {
      alert('Sala agregada con éxito');
      closeCrearSalaModal();

      const nuevaSala = {
        codigoSala,
        nombreSala,
        numSillas,
        cine: {
          nombreCine: document.getElementById('cineAsociadoSelect').selectedOptions[0].textContent.split(' (')[0],
          codigo: codigoCine
        }
      };
      renderizarSala(nuevaSala);
    })
    .catch(err => {
      console.error('Error en fetch:', err);
      alert('Ocurrió un error al registrar la sala.');
    });
}

// ================== ELIMINAR SALA ==================

function eliminarSala() {
  const codigoSala = document.getElementById('codigoSalaEliminar').value.trim();
  const codigoCine = document.getElementById('cineEliminarSelect').value;

  if (!codigoSala || !codigoCine) {
    alert("Debes ingresar el código de la sala y seleccionar un cine.");
    return;
  }

  fetch('/salas/eliminar', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codigoSala, codigoCine })
  })
    .then(res => {
      if (!res.ok) throw new Error("No se pudo eliminar la sala");
      return res.text();
    })
    .then(msg => {
      alert(msg);
      closeEliminarSalaModal();
      cargarSalasExistentes();
    })
    .catch(err => {
      console.error('Error eliminando sala:', err);
      alert("Error al eliminar la sala.");
    });
}

// ================== ACTUALIZAR SALA ==================

function actualizarSala() {
  const codigoSala = document.getElementById('codigoSalaActualizar').value.trim();
  const nuevoNombreSala = document.getElementById('nuevoNombreSala').value.trim();
  const nuevoNumSillas = parseInt(document.getElementById('nuevoNumSillas').value);
  const nuevoCodigoCine = document.getElementById('nuevoCineSelect').value;

  if (!codigoSala || !nuevoNombreSala || isNaN(nuevoNumSillas) || !nuevoCodigoCine) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  fetch('/salas/actualizar', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      codigoSala,
      nuevoNombreSala,
      nuevoNumSillas,
      nuevoCodigoCine
    })
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al actualizar sala");
      return res.text();
    })
    .then(msg => {
      alert(msg);
      closeActualizarSalaModal();
      cargarSalasExistentes();
    })
    .catch(err => {
      console.error('Error al actualizar sala:', err);
      alert("Error al actualizar la sala.");
    });
}

// ================== MODALS ==================

// CREAR
window.openCrearSalaModal = function () {
  document.getElementById('crearSalaModal').style.display = 'block';
  cargarCinesEnSelect(['cineAsociadoSelect']);
};

window.closeCrearSalaModal = function () {
  document.getElementById('crearSalaModal').style.display = 'none';
};

// ELIMINAR
window.openEliminarSalaModal = function () {
  document.getElementById('eliminarSalaModal').style.display = 'block';
  cargarCinesEnSelect(['cineEliminarSelect']);
};

window.closeEliminarSalaModal = function () {
  document.getElementById('eliminarSalaModal').style.display = 'none';
};

// ACTUALIZAR
window.openActualizarSalaModal = function () {
  document.getElementById('actualizarSalaModal').style.display = 'block';
  cargarCinesEnSelect(['nuevoCineSelect']);
};

window.closeActualizarSalaModal = function () {
  document.getElementById('actualizarSalaModal').style.display = 'none';
};
