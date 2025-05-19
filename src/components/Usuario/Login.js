import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { TextField, Button, Box, Typography, Alert, Link } from '@mui/material';
import { Backdrop, CircularProgress } from '@mui/material';


const Login = ({ onLoginSuccess }) => {
    const [correo, setCorreo] = useState('');
    const [pass, setPass] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    correo: correo,
                    pass: pass,
                }),
            });//hola

            const text = await response.text(); // obtenemos el cuerpo como texto
            let data;

            try {
                data = JSON.parse(text); // intentamos parsearlo como JSON
            } catch (err) {
                throw new Error(text); // si no es JSON, lo usamos como mensaje de error directamente
            }

            if (!response.ok) {
                throw new Error(data.message || 'Error en las credenciales');
            }

            setLoading(true); // Muestra la pantalla de carga al entrar a la web
            setMessage('Login exitoso');

            setTimeout(() => {

                localStorage.setItem('usuario', JSON.stringify({ nombre: data.nombre }));

                onLoginSuccess(data); // Ejecuta la lOgica de login después de 1.5s
            }, 1500);

        } catch (error) {
            setMessage(error.message || 'Error de conexión con el servidor');
            console.error('Error:', error);
        }
    };

    const requestPin = () => {
        Swal.fire({
            title: 'Ingrese el PIN',
            input: 'password',
            inputLabel: 'PIN',
            inputPlaceholder: 'Ingrese el PIN para acceder a este apartado',
            inputAttributes: {
                maxlength: 10,
                autocapitalize: 'off',
                autocorrect: 'off',
            },
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
            preConfirm: (pin) => {
                if (pin === '1234') {
                    Swal.fire('Acceso concedido', '', 'success');
                    navigate('/Usuario/CreateUser');
                } else {
                    Swal.showValidationMessage('PIN incorrecto. Inténtelo de nuevo.');
                }
            },
        });
    };

    return (
        <section className="background-radial-gradient" style={{ minHeight: '100vh' }}>
            <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
                <div className="row gx-lg-5 align-items-center mb-5">
                    <div className="col-lg-6 mb-5 mb-lg-0">
                        <h1 className="my-5 display-5 fw-bold ls-tight" style={{ color: '#e5a60d' }}>
                            STACKFLOW<br />
                            <span style={{ color: 'hsl(218, 81%, 95%)' }}>El mejor sistema de ventas</span> <br />
                            <span style={{ color: '#c18cf3' }}>para tu NEGOCIO</span>
                        </h1>
                    </div>
                    <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
                        <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong" style={{ zIndex: 1 }} ></div>
                        <div id="radius-shape-2" className="position-absolute shadow-5-strong" style={{ zIndex: 1 }}></div>

                        <Box
                            sx={{
                                backgroundColor: 'white',
                                padding: 4,
                                borderRadius: 3,
                                boxShadow: 4,
                                maxWidth: 400,
                                mx: 'auto',
                                my: 5,
                                position: 'relative',
                                zIndex: 1
                            }}
                        >
                            <form onSubmit={handleSubmit}>
                                <Typography variant="h4" component="h1" gutterBottom align="center">
                                    Iniciar sesión
                                </Typography>
                                <TextField
                                    label="Correo electrónico"
                                    variant="outlined"
                                    type="email"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    fullWidth

                                    margin="normal"
                                />
                                <TextField
                                    label="Contraseña"
                                    variant="outlined"
                                    type="password"
                                    value={pass}
                                    onChange={(e) => setPass(e.target.value)}
                                    fullWidth

                                    margin="normal"
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2, mb: 2 }}
                                >
                                    Iniciar sesión
                                </Button>
                                {message && (
                                    <Alert severity={message === 'Login exitoso' ? 'success' : 'error'}>
                                        {message}
                                    </Alert>
                                )}
                                <Box textAlign="center" sx={{ mt: 2 }}>
                                    <Typography variant="body2">¿No tienes una cuenta?</Typography>
                                    <Link
                                        component="button"
                                        underline="hover"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            requestPin();
                                        }}
                                        color="primary"
                                    >
                                        Registrar aquí
                                    </Link>

                                </Box>
                            </form>
                        </Box>
                    </div>
                </div>
            </div>
            {/* Estilos personalizados */}
            <style jsx>{`
                html, body {
                    height: 100%;
                    margin: 0;
                    padding: 0;
                }

                .background-radial-gradient {
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: hsl(218, 41%, 15%);
                    background-image: radial-gradient(800px circle at 0% 0%,
                        hsl(218, 41%, 35%) 15%,
                        hsl(218, 41%, 30%) 35%,
                        hsl(218, 41%, 20%) 75%,
                        hsl(218, 41%, 19%) 80%,
                        transparent 100%),
                        radial-gradient(1250px circle at 100% 100%,
                        hsl(218, 41%, 45%) 15%,
                        hsl(218, 41%, 30%) 35%,
                        hsl(218, 41%, 20%) 75%,
                        hsl(218, 41%, 19%) 80%,
                        transparent 100%);
                }

                #radius-shape-1 {
                    height: 220px;
                    width: 220px;
                    top: -60px;
                    left: -130px;
                    background: radial-gradient(#44006b, #ad1fff);
                    overflow: hidden;
                }

                #radius-shape-2 {
                    border-radius: 38% 62% 63% 37% / 70% 33% 67% 30%;
                    bottom: -60px;
                    right: -90px;
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(#44006b, #ad1fff);
                    overflow: hidden;
                }
            `}</style>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

        </section>
    );
};

export default Login;
