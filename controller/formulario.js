// Detector de carga desde la caché (BFCache)
window.addEventListener('pageshow', (event) => {
    // Si la página se está mostrando desde la memoria caché del navegador...
    if (event.persisted) {
        console.warn("Se detectó una carga desde la caché. Forzando recarga de seguridad...");
        // ...forzamos a que la página se recargue completamente
        window.location.reload();
    }
});

// Función para obtener y mostrar la lista de estados
async function cargarEstados() {
    try {
        const url = 'https://registropnfd.unem.edu.ve/index.php?action=obtener_estados';
        const response = await fetch(url, {
            method: 'GET'
        });

        const estados = await response.json();

        // Seleccionamos el elemento <select> del HTML usando su ID
        const selectEstado = document.getElementById('estado_id');

        // Nos aseguramos de mantener la opción por defecto
        selectEstado.innerHTML = '<option value="">Seleccione Estado...</option>';

        // Recorremos el arreglo de estados que nos devolvió la API
        estados.forEach(estado => {
            // Creamos un nuevo elemento <option>
            const option = document.createElement('option');

            // Asignamos el id como valor y el nombre como texto visible
            option.value = estado.id;
            option.textContent = estado.nombre;

            // Agregamos esta nueva opción al <select>
            selectEstado.appendChild(option);
        });


    } catch (error) {
        console.error("Error al cargar la lista de estados:", error);
    }
}

// Función para obtener los municipios según el estado seleccionado
async function cargarMunicipios(estadoId) {
    const selectMunicipio = document.getElementById('municipio_id');
    const selectParroquia = document.getElementById('parroquia_id');

    // Limpiamos los selects de municipio y parroquia cada vez que cambia el estado
    selectMunicipio.innerHTML = '<option value="">Seleccione Municipio...</option>';
    selectParroquia.innerHTML = '<option value="">Seleccione Parroquia...</option>';

    // Si el usuario volvió a elegir "Seleccione Estado...", detenemos la ejecución
    if (!estadoId) {
        return;
    }

    try {
        // Insertamos el estadoId dinámicamente en la URL
        const url = `https://registropnfd.unem.edu.ve/index.php?action=obtener_municipios&estado_me_id=${estadoId}`;
        const response = await fetch(url, {
            method: 'GET'
        });

        const municipios = await response.json();

        // Recorremos el arreglo y creamos las opciones
        municipios.forEach(municipio => {
            const option = document.createElement('option');
            option.value = municipio.id;
            // Asumimos que la propiedad se llama 'nombre' igual que en el JSON de estados
            option.textContent = municipio.nombre;

            selectMunicipio.appendChild(option);
        });


    } catch (error) {
        console.error("Error al cargar la lista de municipios:", error);
    }
}

// Función para obtener las parroquias según el municipio seleccionado
async function cargarParroquias(municipioId) {
    const selectParroquia = document.getElementById('parroquia_id');

    // Limpiamos el select de parroquia cada vez que cambia el municipio
    selectParroquia.innerHTML = '<option value="">Seleccione Parroquia...</option>';

    // Si el usuario seleccionó "Seleccione Municipio...", detenemos la ejecución
    if (!municipioId) {
        return;
    }

    try {
        // Insertamos el municipioId dinámicamente en la URL
        const url = `https://registropnfd.unem.edu.ve/index.php?action=obtener_parroquias&municipio_me_id=${municipioId}`;
        const response = await fetch(url, {
            method: 'GET'
        });

        const parroquias = await response.json();

        // Recorremos el arreglo y creamos las opciones
        parroquias.forEach(parroquia => {
            const option = document.createElement('option');
            option.value = parroquia.parroquia_me_id;
            // Seguimos asumiendo que el campo de texto se llama 'nombre'
            option.textContent = parroquia.nombre;

            selectParroquia.appendChild(option);
        });

    } catch (error) {
        console.error("Error al cargar la lista de parroquias:", error);
    }
}

// Función para obtener y mostrar los niveles de instrucción
async function cargarNivelInstruccion() {
    try {
        const url = 'https://registropnfd.unem.edu.ve/index.php?action=nivel_instrucciones';
        const response = await fetch(url, {
            method: 'GET'
        });

        const niveles = await response.json();

        // Seleccionamos el elemento <select> del Nivel de Instrucción
        const selectNivelInstruccion = document.getElementById('nivel_instruccion_id');

        // Nos aseguramos de mantener la opción por defecto
        selectNivelInstruccion.innerHTML = '<option value="">Seleccione Instrucción...</option>';

        // Recorremos el arreglo de niveles
        niveles.forEach(nivel => {
            const option = document.createElement('option');

            option.value = nivel.id;
            option.textContent = nivel.nombre;

            selectNivelInstruccion.appendChild(option);
        });


    } catch (error) {
        console.error("Error al cargar la lista de niveles de instrucción:", error);
    }
}

// Función para obtener y mostrar los niveles
async function cargarNiveles() {
    try {
        const url = 'https://registropnfd.unem.edu.ve/index.php?action=obtener_nivel';
        const response = await fetch(url, {
            method: 'GET'
        });

        const niveles = await response.json();
        const selectNivel = document.getElementById('nivel_id');

        selectNivel.innerHTML = '<option value="">Seleccione Nivel...</option>';

        niveles.forEach(nivel => {
            const option = document.createElement('option');
            option.value = nivel.id;
            option.textContent = nivel.nombre;
            selectNivel.appendChild(option);
        });


    } catch (error) {
        console.error("Error al cargar la lista de niveles:", error);
    }
}

// Función para obtener los subniveles según el nivel seleccionado
async function cargarSubniveles(nivelId) {
    const selectSubnivel = document.getElementById('subnivel_id');

    // Limpiamos el select de subnivel cada vez que cambia el nivel principal
    selectSubnivel.innerHTML = '<option value="">Seleccione Subnivel...</option>';

    // Si el usuario vuelve a la opción por defecto, nos detenemos aquí
    if (!nivelId) {
        return;
    }

    try {
        const url = `https://registropnfd.unem.edu.ve/index.php?action=obtener_subnivel&nivel_id=${nivelId}`;
        const response = await fetch(url, {
            method: 'GET'
        });

        const subniveles = await response.json();

        subniveles.forEach(subnivel => {
            const option = document.createElement('option');
            option.value = subnivel.id;
            option.textContent = subnivel.nombre;
            selectSubnivel.appendChild(option);
        });


    } catch (error) {
        console.error("Error al cargar la lista de subniveles:", error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Intentamos obtener el token y la cédula desde localStorage
    let token = localStorage.getItem('authToken');
    let cedula = localStorage.getItem('userCedula') || '';

    // Si no hay token en localStorage, intentamos leerlo desde la query string
    if (!token) {
        const params = new URLSearchParams(window.location.search);
        const tokenFromUrl = params.get('token');
        const cedulaFromUrl = params.get('cedula');
        if (tokenFromUrl) {
            token = tokenFromUrl;
            localStorage.setItem('authToken', tokenFromUrl);
        }
        if (cedulaFromUrl) {
            cedula = cedulaFromUrl;
            localStorage.setItem('userCedula', cedulaFromUrl);
        }
    }

    // Si aún no hay token, se requiere iniciar sesión
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

    await cargarEstados();
    await cargarNiveles();
    await cargarNivelInstruccion();

    const selectEstado = document.getElementById('estado_id');
    selectEstado.addEventListener('change', (event) => {
        cargarMunicipios(event.target.value);
    });

    const selectMunicipio = document.getElementById('municipio_id');
    selectMunicipio.addEventListener('change', (event) => {
        cargarParroquias(event.target.value);
    });

    const selectNivel = document.getElementById('nivel_id');
    selectNivel.addEventListener('change', (event) => {
        cargarSubniveles(event.target.value);
    });

    // TODO: Reemplazar la URL por la ruta real a la que le pasarás el nuevo token para obtener los datos
    const API_DATOS_URL = `https://registropnfd.unem.edu.ve/index.php?action=validar_director&cedula=${cedula}`;

    try {
        const response = await fetch(API_DATOS_URL, {
            method: 'GET',
            // O agregar headers si la API lo requiere, como:
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        document.getElementById('nombre').value = data.data.nombres || '';
        document.getElementById('apellido').value = data.data.apellidos || '';
        document.getElementById('cedula').value = data.data.cedula || '';
        document.getElementById('nacionalidad').value = data.data.nacionalidad || '';
        document.getElementById('telefono').value = data.data.telefono || '';
        document.getElementById('direccion').value = data.data.direccion || '';
        document.getElementById('genero').value = data.data.genero || '';
        document.getElementById('nivel_instruccion_id').value = data.data.nivel_instruccion_id || '';

        // 2. Lógica en cascada para Ubicación Geográfica
        const estadoGuardado = data.data.estado_id;
        if (estadoGuardado) {
            document.getElementById('estado_id').value = estadoGuardado;

            // Forzamos la carga de los municipios de este estado ANTES de asignar el municipio
            await cargarMunicipios(estadoGuardado);

            const municipioGuardado = data.data.municipio_id;
            if (municipioGuardado) {
                document.getElementById('municipio_id').value = municipioGuardado;

                // Forzamos la carga de las parroquias de este municipio ANTES de asignar la parroquia
                await cargarParroquias(municipioGuardado);
                document.getElementById('parroquia_id').value = data.data.parroquia_id || '';
            }
        }



        // 3. Lógica en cascada para Niveles Académicos
        const nivelGuardado = data.data.nivel_id;
        if (nivelGuardado) {
            document.getElementById('nivel_id').value = nivelGuardado;

            // Forzamos la carga de los subniveles ANTES de asignar el subnivel
            await cargarSubniveles(nivelGuardado);
            document.getElementById('subnivel_id').value = data.data.subnivel_id || '';
        }

    } catch (error) {
        console.error("Error al obtener los datos:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'Hubo un problema al tratar de cargar los datos.',
        }).then(() => {
            window.location.href = 'index.html';
        });;
    }

    // Lógica opcional para manejar el guardado del formulario
    // Lógica para manejar el guardado del formulario
    document.getElementById('datosForm').addEventListener('submit', async (e) => {
        // Prevenimos que la página se recargue al enviar el formulario
        e.preventDefault();

        // Función auxiliar para obtener enteros o null
        function getIntValue(id) {
            const val = document.getElementById(id).value;
            if (!val || val.trim() === '') return null;
            const num = parseInt(val, 10);
            return isNaN(num) ? null : num;
        }

        // 1. Recopilamos todos los valores del formulario
        const payload = {
            cedula: document.getElementById('cedula').value, // Incluimos la cédula como identificador
            nacionalidad: document.getElementById('nacionalidad').value,
            nombres: document.getElementById('nombre').value,
            apellidos: document.getElementById('apellido').value,
            genero: document.getElementById('genero').value,
            telefono: document.getElementById('telefono').value,
            direccion: document.getElementById('direccion').value,
            estado_id: getIntValue('estado_id'),
            municipio_id: getIntValue('municipio_id'),
            parroquia_id: getIntValue('parroquia_id'),
            nivel_instruccion_id: getIntValue('nivel_instruccion_id'),
            nivel_id: getIntValue('nivel_id'),
            subnivel_id: getIntValue('subnivel_id')
        };

        const requiredNumbers = ['estado_id', 'municipio_id', 'parroquia_id', 'nivel_instruccion_id', 'nivel_id', 'subnivel_id'];
        const missingNumbers = requiredNumbers.filter(field => payload[field] === null);
        if (missingNumbers.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: `Debe seleccionar: ${missingNumbers.join(', ')}`
            });
            return;
        }

        // Validar campos de texto
        if (!payload.nombres || !payload.apellidos || !payload.genero || !payload.telefono || !payload.direccion) {
            Swal.fire({
                icon: 'warning',
                title: 'Faltan datos',
                text: 'Por favor complete todos los campos del formulario.'
            });
            return;
        }


        // NUEVO: Capturamos el botón de guardar y guardamos su texto original
        const btnGuardar = document.querySelector('#datosForm button[type="submit"]');
        const textoOriginalBtn = btnGuardar.innerHTML;

        // NUEVO: Mostramos el spinner y deshabilitamos el botón
        btnGuardar.disabled = true;
        btnGuardar.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Guardando...';

        // 2. Preparamos el envío al servidor
        try {
            // Recuperamos el token por si la API lo requiere para autorizar la actualización
            const tokenGuardado = localStorage.getItem('authToken');

            // Construimos la URL (Añadimos el token a la URL siguiendo el patrón de tus APIs anteriores)
            const urlActualizacion = `https://registropnfd.unem.edu.ve/index.php?action=actualizar_directores`;

            // Hacemos la petición PUT
            const response = await fetch(urlActualizacion, {
                method: 'PUT',
                headers: {
                    // Le decimos al servidor que el "body" va en formato JSON
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenGuardado}`
                },
                body: JSON.stringify(payload)
            });

            // Leemos la respuesta del servidor
            const result = await response.json();

            // 3. Evaluamos si la actualización fue exitosa
            if (result.success === true || result.success === 'true') {
                Swal.fire({
                    icon: 'success',
                    title: '¡Datos Guardados!',
                    text: result.message,
                    showCancelButton: true, // Habilita el segundo botón
                    confirmButtonText: 'Finalizar', // Botón principal
                    cancelButtonText: 'Continuar edición', // Botón secundario
                    confirmButtonColor: '#206bc4', // Color azul (estilo Tabler/Bootstrap)
                    cancelButtonColor: '#6c757d'  // Color gris
                }).then((swalResult) => {
                    if (swalResult.isConfirmed) {
                        // Si hizo clic en "Finalizar"
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('userCedula'); 
                        window.location.replace('index.html'); 
                    } 
                });
            } else {
                // Si success es false, mostramos el mensaje de error del servidor (o uno por defecto)
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar',
                    text: result.message || 'Ocurrió un problema al guardar los datos. Intente nuevamente.'
                });
            }

        } catch (error) {
            console.error("Error de conexión al hacer el PUT:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error de Red',
                text: 'No se pudo conectar con el servidor. Verifique su conexión a internet.'
            });
        } finally {
            // NUEVO: Restauramos el botón a su estado original pase lo que pase
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = textoOriginalBtn;
        }
    });
});
