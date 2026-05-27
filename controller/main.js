const API_URL = 'https://autogestion.mppe.gob.ve/api/sign-in';

function decodificarToken(token) {
    try {
        // El JWT tiene 3 partes separadas por puntos. El payload es la segunda parte [1].
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // Decodificamos la cadena de Base64 a texto y luego a un objeto JSON
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null; // Retornamos null si el token no es válido
    }
}

async function validarDirector(identidadConFormato, token) {
    try {
        // Separamos "V-XXXXXXXX" por el guion y tomamos la segunda parte [1] (los números)
        // Usamos un condicional por si acaso la identidad ya viniera sin el formato "V-"
        const cedulaLimpia = identidadConFormato.includes('-')
            ? identidadConFormato.split('-')[1]
            : identidadConFormato;

        console.log(`Cédula formateada para la consulta: ${cedulaLimpia}`);

        localStorage.setItem('userCedula', cedulaLimpia);

        // Construimos la URL con los parámetros requeridos (cédula y token)
        const url = `https://registropnfd.unem.edu.ve/index.php?action=validar_director&cedula=${cedulaLimpia}`;

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        console.log("Respuesta de la validación del director:", data);

        // Evaluamos si la respuesta del servidor es exitosa
        if (data.success === true || data.success === 'true') {
            console.log("¡Validación exitosa! El usuario es un director registrado.");

            // Redirigimos pasando el token y la cédula en la query string
            // Esto ayuda cuando se abre el archivo vía file:// y localStorage no se comparte
            const queryToken = encodeURIComponent(token);
            const queryCedula = encodeURIComponent(cedulaLimpia);
            window.location.href = `formulario.html?token=${queryToken}&cedula=${queryCedula}`;

        } else {
            // Si success es false, mostramos el mensaje solicitado
            //console.error("Error: Usuario no registrado");
            // alert("Usuario no registrado");
            // Nota: Si usas SweetAlert en tu proyecto, puedes cambiar el alert por:
            Swal.fire({ icon: 'error', title: 'Error', text: data.error });
        }

    } catch (error) {
        console.error("Error al conectar con el endpoint de validación:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const sendButton = document.getElementById('send');
    const spinner = document.getElementById('spinner');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validación básica
        if (!email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, ingrese su correo y contraseña.',
            });
            return;
        }

        // Mostrar spinner y deshabilitar botón mientras se hace la petición
        spinner.classList.remove('d-none');
        sendButton.disabled = true;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Ajusta el nombre de los campos según lo que espere tu API (ej: username, password)
                body: JSON.stringify({ email, password })
            });

            const tipoContenido = response.headers.get('content-type');

            if (tipoContenido.includes('text/plain')) {
                // Guardar el token en localStorage para usarlo en futuras peticiones
                const token = await response.text();

                localStorage.setItem('authToken', token);

                const tokenActual = token

                if (tokenActual) {
                    try {
                        // Hacemos la petición al servidor usando GET
                        const res = await fetch(`https://registropnfd.unem.edu.ve/index.php?action=iniciar_sesion&token=${tokenActual}`, {
                            method: 'GET',
                        });

                        const data = await res.json();

                        // Verificamos si la respuesta fue exitosa
                        if (data.success === true && data.token) {

                            await Swal.fire({
                                icon: 'success',
                                title: 'Inicio de sesión exitoso',
                                confirmButtonText: 'Continuar'
                            });
                            const nuevoToken = data.token;

                            // Guardamos el NUEVO token en el localStorage para la otra página
                            localStorage.setItem('authToken', nuevoToken);

                            // Decodificamos el nuevo token
                            const payloadDecodificado = decodificarToken(nuevoToken);

                            // Verificamos que el payload tenga la información que buscamos
                            if (payloadDecodificado && payloadDecodificado.data) {

                                // Almacenamos la identidad en una variable
                                let identidad = payloadDecodificado.data.identidad;

                                await validarDirector(identidad, nuevoToken);

                            } else {
                                console.error("El token fue recibido, pero no tiene el formato esperado (faltan datos).");
                            }

                        } else {
                            console.warn("El servidor respondió, pero el inicio de sesión falló:", data.message);
                            // Aquí podrías mostrar el modal de SweetAlert (Swal.fire) indicando error
                        }

                    } catch (error) {
                        console.error("Error de red o al conectar con la URL:", error);
                    }
                } else {
                    console.error("No hay token guardado inicial. El usuario debe iniciar sesión primero.");
                }
            } else {
                const data = await response.json();
                await Swal.fire({
                    icon: 'warning',
                    title: 'Error de autenticación',
                    text: data.alert.message,
                });
                //throw new Error('Credenciales inválidas o error en el servidor');
            }
        } catch (error) {
            console.error('Error de autenticación:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de verificación',
                text: error.message || 'No se pudo conectar con el servidor.',
            });
        } finally {
            // Ocultar spinner y habilitar botón de nuevo
            spinner.classList.add('d-none');
            sendButton.disabled = false;
        }
    });
});
