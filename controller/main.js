const API_URL = 'https://autogestion.mppe.gob.ve/api/sign-in'; // TODO: Reemplazar con la URL de tu endpoint

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

            const token = await response.text();

            if (response.ok && token) {
                // Guardar el token en localStorage para usarlo en futuras peticiones
                localStorage.setItem('authToken', token);

                Swal.fire({
                    icon: 'success',
                    title: 'Autenticación exitosa',
                    text: 'Token obtenido correctamente.',
                    timer: 2000,
                    showConfirmButton: false
                }).then(async () => {
                    const token = localStorage.getItem('authToken');
                    if (token) {
                        try {
                            const res = await fetch(`https://registropnfd.unem.edu.ve/index.php?action=iniciar_sesion&token=${token}`, {
                                method: 'GET', // Cambiado a GET, ya que los parámetros van en la URL. Si es estrictamente POST, cámbialo.
                                // headers: { 'Content-Type': 'application/json' }
                            });
                            
                            // Leemos la respuesta como texto primero para ver exactamente qué devuelve el servidor
                            const rawText = await res.text();
                            console.log("Respuesta cruda del segundo endpoint:", rawText);

                            // Intentamos convertir a JSON si es posible
                            try {
                                const data = JSON.parse(rawText);
                                console.log("Respuesta en JSON:", data);
                            } catch (e) {
                                console.warn("Nota: La respuesta no es un JSON válido. Esto es normal si el servidor devuelve HTML.");
                            }

                        } catch (error) {
                            console.error("Error al conectar con la segunda URL:", error);
                        }
                    } else {
                        console.error("No hay token guardado. El usuario debe iniciar sesión primero.");
                    }
                });
            } else {
                throw new Error('Credenciales inválidas o error en el servidor');
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
