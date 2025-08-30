let modoEdicion = false;
let codigoEditando = null;
// Abrir modal
window.openCineModal = function () {
    document.getElementById('cineModal').style.display = 'block';
};

// Cerrar modal
window.closeCineModal = function () {
    document.getElementById('cineModal').style.display = 'none';
};

// Cargar cines al iniciar
function cargarCines() {
    fetch('/cines/obtener')
        .then(res => res.json())
        .then(cines => {
            cines.forEach(cine => agregarCineADOM(cine));
        })
        .catch(err => {
            console.error('Error al cargar cines:', err);
        });
}

// Crear cine desde modal
window.agregarCine = function () {
    const codigo = document.getElementById('codigoCine').value.trim();
    const nombreCine = document.getElementById('nombreCine').value.trim();
    const direccionCine = document.getElementById('direccionCine').value.trim();
    const ciudadCine = document.getElementById('ciudadCine').value.trim();

    if (!nombreCine || !direccionCine || !ciudadCine || !codigo) {
        alert('Completa todos los campos');
        return;
    }

    if (modoEdicion) {
        // Actualizar cine existente
        fetch('/cines/actualizar', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo, nombreCine, direccionCine, ciudadCine })
        })
        .then(res => {
            if (!res.ok) throw new Error("Error al actualizar cine");
            return res.text();
        })
        .then(() => {
            alert('Cine actualizado con éxito');
            closeCineModal();
            limpiarFormulario();
            recargarListaCines();
        })
        .catch(err => {
            console.error('Error en actualización:', err);
            alert('Ocurrió un error al actualizar el cine.');
        });
    } else {
        // Crear cine nuevo
        fetch('/cines/ingresarCine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ codigo, nombreCine, direccionCine, ciudadCine })
        })
        .then(res => {
            if (!res.ok) throw new Error("Error al registrar cine");
            return res.text();
        })
        .then(() => {
            const nuevoCine = { codigo, nombreCine, direccionCine, ciudadCine };
            agregarCineADOM(nuevoCine); 
            closeCineModal();
            limpiarFormulario();
            alert('Cine agregado con éxito');
        })
        .catch(err => {
            console.error('Error en creación:', err);
            alert('Ocurrió un error al registrar el cine.');
        });
    }
};

// Agrega un cine a la vista
function agregarCineADOM(cine) {
    const lista = document.getElementById('listaCines');

    const item = document.createElement('div');
    item.className = 'cine-item';

    // Contenedor de info y botones
    const contenedorInfoBotones = document.createElement('div');
    contenedorInfoBotones.style.display = 'flex';
    contenedorInfoBotones.style.justifyContent = 'space-between';
    contenedorInfoBotones.style.width = '100%';
    contenedorInfoBotones.style.alignItems = 'center';

    // Info del cine
    const info = document.createElement('div');
    info.className = 'cine-info';
    info.innerHTML = `
        <div><strong>Nombre:</strong> ${cine.nombreCine}</div>
        <div><strong>Dirección:</strong> ${cine.direccionCine}</div>
        <div><strong>Ciudad:</strong> ${cine.ciudadCine}</div>
    `;

    // Botones
    const botones = document.createElement('div');
    botones.className = 'cine-buttons';

    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'btn-eliminar';
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.onclick = () => eliminarCine(cine.codigo, item);

    const btnActualizar = document.createElement('button');
    btnActualizar.className = 'btn-actualizar';
    btnActualizar.textContent = 'Actualizar';
    btnActualizar.onclick = () => actualizarCine(cine); // modal opcional

    botones.appendChild(btnEliminar);
    botones.appendChild(btnActualizar);

    contenedorInfoBotones.appendChild(info);
    contenedorInfoBotones.appendChild(botones);

    
    const imagen = document.createElement('div');
    imagen.className = 'cine-imagen';
    imagen.innerHTML = `<img src="/src/img/Cines.webp" alt="">`; // 👈 Cambia a la ruta real

    // Estructura final
    item.appendChild(contenedorInfoBotones);
    item.appendChild(imagen);

    lista.appendChild(item);
}

// Eliminar cine
function eliminarCine(codigo, divCine) {
  if (confirm('¿Estás seguro de que deseas eliminar este cine?')) {
    fetch(`/cines/eliminar`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ codigo })
    })
    .then(res => {
      if (!res.ok) throw new Error("No se pudo eliminar el cine");
      return res.text();
    })
    .then(msg => {
      alert(msg);
      if (divCine) divCine.remove(); 
    })
    .catch(err => {
      console.error('Error al eliminar cine:', err);
      alert('Hubo un error al eliminar el cine.');
    });
  }
}


function actualizarCine(cine) {
    modoEdicion = true;
    codigoEditando = cine.codigo;

    
    document.getElementById('codigoCine').value = cine.codigo;
    document.getElementById('nombreCine').value = cine.nombreCine;
    document.getElementById('direccionCine').value = cine.direccionCine;
    document.getElementById('ciudadCine').value = cine.ciudadCine;

    
    document.getElementById('codigoCine').disabled = true;
    openCineModal();
}


function limpiarFormulario() {
    document.getElementById('codigoCine').value = "";
    document.getElementById('nombreCine').value = "";
    document.getElementById('direccionCine').value = "";
    document.getElementById('ciudadCine').value = "";

    
    document.getElementById('codigoCine').disabled = false;
    modoEdicion = false;
    codigoEditando = null;
}

function recargarListaCines() {
    const lista = document.getElementById('listaCines');
    lista.innerHTML = "";
    cargarCines();
}