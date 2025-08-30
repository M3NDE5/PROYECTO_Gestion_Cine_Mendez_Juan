let usuariosFetch = [];
let usuariosMostrar = [];

const btnLista = document.getElementById('btn-lista');

btnLista.addEventListener('click', async () => {
  try {
    const res = await fetch('/usuarios/obtener');
    const data = await res.json();
    usuariosFetch = data;
    usuariosMostrar = usuariosFetch.map(u => u.email);

    const lista = document.getElementById('listaPersonas');
    lista.innerHTML = "";

    usuariosMostrar.forEach((email) => {
      const contenedor = document.createElement("div");
      contenedor.className = "usuario-item";

      const nombre = document.createElement("div");
      nombre.className = "nombre";
      nombre.innerText = "Email: " + email;

      const btnEliminar = document.createElement("button");
      btnEliminar.innerText = "Eliminar";
      btnEliminar.className = "btn-eliminar";
      btnEliminar.addEventListener("click", () => {
        eliminarUsuario(email, contenedor);
      });

      const btnActualizar = document.createElement("button");
      btnActualizar.innerText = "Actualizar";
      btnActualizar.className = "btn-actualizar";
      btnActualizar.addEventListener("click", () => {
        actualizarUsuario(email); 
      });

      contenedor.appendChild(nombre);
      contenedor.appendChild(btnEliminar);
      contenedor.appendChild(btnActualizar);

      lista.appendChild(contenedor);
    });

  } catch (err) {
    console.error('Error al obtener usuarios:', err);
  }
});

window.openModal = function () {
  document.getElementById("modal").style.display = "block";
};

window.closeModal = function () {
  document.getElementById("modal").style.display = "none";
};

window.agregarPersona = function () {
  const email = document.getElementById("nombreUsuario").value;
  const contrasena = document.getElementById("contrasena").value;

  if (email.trim() !== "" && contrasena.trim() !== "") {
    document.getElementById("nombreUsuario").value = "";
    document.getElementById("contrasena").value = "";

    fetch('/usuarios/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: contrasena
      })
    })
    .then(res => {
      if (!res.ok) throw new Error("Error al registrar usuario");
      return res.text();
    })
    .then(data => {
      console.log('Respuesta:', data);
      alert('Usuario agregado con éxito');
      closeModal();
    })
    .catch(err => {
      console.error('Error en fetch:', err);
      alert('Ocurrió un error al registrar el usuario.');
    });
  } else {
    alert("Por favor, completa ambos campos.");
  }
};

window.eliminarUsuario = function (email, div) {
  fetch('/usuarios/eliminar', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  })
  .then(res => {
    if (!res.ok) throw new Error("Error al eliminar usuario");
    return res.text();
  })
  .then(data => {
    console.log('Usuario eliminado:', data);
    div.remove(); 
    alert('Usuario eliminado con éxito');
  })
  .catch(err => {
    console.error('Error al eliminar usuario:', err);
    alert('Error al eliminar usuario');
  });
};


let emailActualAEditar = ""; // Variable temporal para guardar el email

window.actualizarUsuario = function (email) {
  emailActualAEditar = email;
  document.getElementById("emailAnterior").value = email;
  document.getElementById("nuevoEmail").value = "";
  document.getElementById("modal-actualizar").style.display = "block";
};

window.cerrarModalActualizar = function () {
  document.getElementById("modal-actualizar").style.display = "none";
};

window.guardarActualizacion = function () {
  const nuevoEmail = document.getElementById("nuevoEmail").value.trim();

  if (nuevoEmail === "") {
    alert("El nuevo correo no puede estar vacío");
    return;
  }

  fetch('/usuarios/actualizar', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      actualEmail: emailActualAEditar,
      nuevoEmail: nuevoEmail
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Error al actualizar");
    return res.text();
  })
  .then(data => {
    console.log('Actualizado:', data);
    alert('Usuario actualizado correctamente');
    cerrarModalActualizar();
    btnLista.click(); // Recarga la lista de usuarios
  })
  .catch(err => {
    console.error('Error al actualizar:', err);
    alert('Ocurrió un error al actualizar el usuario');
  });
};
