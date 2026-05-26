document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    const cedula = localStorage.getItem('userCedula') || '';

    // Si no hay token, significa que no ha iniciado sesión o no pasó la verificación
    if (!token) {
        Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'No se encontró el token de autenticación. Por favor inicie sesión.',
        }).then(() => {
            window.location.href = 'index.html';
        });
        return;
    }

    // TODO: Reemplazar la URL por la ruta real a la que le pasarás el nuevo token para obtener los datos
    const API_DATOS_URL = `https://registropnfd.unem.edu.ve/index.php?action=validar_director&cedula=${cedula}`;

    try {
        const response = await fetch(API_DATOS_URL, {
            method: 'GET',
            // O agregar headers si la API lo requiere, como:
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();
        console.log("Datos obtenidos del servidor:", data);

        // Rellenamos el formulario con los datos, si es que existen en la respuesta
        // Si hay campos vacíos o undefined, se coloca un string vacío '' para que se puedan rellenar manualmente
        document.getElementById('nombre').value = data.nombres || '';
        document.getElementById('apellido').value = data.apellidos || '';
        document.getElementById('cedula').value = data.cedula || '';

    } catch (error) {
        console.error("Error al obtener los datos:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'Hubo un problema al tratar de cargar los datos.',
        });
    }

    // Lógica opcional para manejar el guardado del formulario
    document.getElementById('datosForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const cedula = document.getElementById('cedula').value;

        console.log("Datos a enviar:", { nombre, apellido, cedula });
        // Aquí puedes hacer otro fetch para enviar o actualizar los datos
        Swal.fire({
            icon: 'success',
            title: 'Formulario enviado',
            text: 'Los datos fueron procesados (simulado).',
        });
    });
});
