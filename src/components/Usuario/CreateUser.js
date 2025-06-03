import React, { useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useNavigate } from 'react-router-dom';
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, TextField, MenuItem } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box } from '@mui/material';
const CreateUser = () => {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [pass, setPass] = useState('');
    const [rol, setRol] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña

    const handleSubmit = async (e) => {
        e.preventDefault();

        const usuario = {
            nombre,
            correo,
            pass,
            rol
        };//holaa

        const response = await fetch('https://stackflowbackend.onrender.com/api/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario),
        });


        if (response.ok) {
            Swal.fire({
                title: 'Registro exitoso',
                text: 'El usuario ha sido registrado correctamente',
                icon: 'success',
                confirmButtonText: 'Ir al inicio',
                showCancelButton: true,
                cancelButtonText: 'Seguir registrando',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/');
                }
            });

            // Limpiar el formulario
            setNombre('');
            setCorreo('');
            setPass('');
            setRol('');
        } else {
            Swal.fire('Error', 'Hubo un problema al registrar el usuario', 'error');
        }
    };

    const handleClick = () => {
        navigate('/');
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    // Verificar que los campos estén completos
    const isFormValid = () => {
        return nombre && correo && pass && rol;
    };

    return (
        <section className="background-radial-gradient">

            <button type="button" className="btn btn-secondary position-absolute top-0 end-0 m-3" onClick={handleClick}>
                Regresar al inicio
            </button>
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

            <div className="row gx-lg-5 align-items-center mb-5">
                <div className="col-lg-6 mb-5 mb-lg-0">
                    <h1 className="my-5 display-5 fw-bold ls-tight" style={{ color: '#e5a60d' }}>
                        STACKFLOW<br />
                        <span style={{ color: 'hsl(218, 81%, 95%)' }}>El mejor sistema de ventas</span> <br />
                        <span style={{ color: '#c18cf3' }}>para tu NEGOCIO</span>
                    </h1>
                </div>

                <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
                    <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
                    <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

                    <Box
                        sx={{
                            backgroundColor: 'white',
                            padding: 4,
                            borderRadius: 3,
                            boxShadow: 4,
                            maxWidth: 500,
                            mx: 'auto',
                            my: 5,
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        <form onSubmit={handleSubmit} className="container mt-6">
                            <h1 className="text-center mb-4">Crear una cuenta</h1>

                            <div className="form-outline mb-4">
                                <TextField
                                    label="Nombre"
                                    variant="outlined"
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    fullWidth
                                />
                            </div>

                            <div className="form-outline mb-4">
                                <TextField
                                    label="Correo"
                                    variant="outlined"
                                    type="text"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    fullWidth
                                />
                            </div>

                            <div className="form-outline mb-4">
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
                                    <OutlinedInput
                                        type={showPassword ? 'text' : 'password'}
                                        value={pass}
                                        onChange={(e) => setPass(e.target.value)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    onMouseUp={handleMouseUpPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Contraseña"
                                    />
                                </FormControl>
                            </div>


                            <div className="form-outline mb-4">
                                <TextField

                                    select
                                    label="Seleccionar un rol"
                                    value={rol}
                                    onChange={(e) => setRol(e.target.value)}
                                    fullWidth
                                >
                                    <MenuItem value="" disabled>Roles</MenuItem>
                                    <MenuItem value="Administrador">Administrador</MenuItem>
                                    <MenuItem value="Empleado">Empleado</MenuItem>
                                </TextField>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-block w-100"
                                disabled={!isFormValid()}
                            >
                                Registrar
                            </button>

                        </form>
                    </Box>


                </div>
            </div>


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
                    background: linear-gradient(to bottom, #0f172a, #1e3a8a); /* azul oscuro degradado */
                }
                

                .btn-disabled {
                    background-color: #cccccc;
                    color: #666666;
                    cursor: not-allowed;
                }
            `}</style>
        </section>
    );
};

export default CreateUser;
