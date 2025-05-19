import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const UserDropdown = ({ userData, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Generamos una clave única basada en el ID del usuario
    const userKey = `avatar_${userData.id || userData.nombre}`;

    // Inicializamos la imagen desde localStorage o usamos una predeterminada
    const [imagen, setImagen] = useState(() => {
        return localStorage.getItem(userKey) || '/static/images/avatar/default.jpg';
    });

    const manejarCambioDeImagen = (event) => {
        const archivo = event.target.files[0];
        if (archivo) {
            const reader = new FileReader(); // Utilizamos FileReader para obtener un string base64
            reader.onloadend = () => {
                const nuevaImagen = reader.result; // Imagen en formato base64
                setImagen(nuevaImagen);
                localStorage.setItem(userKey, nuevaImagen); // Guardamos la imagen base64 con la clave única
            };
            reader.readAsDataURL(archivo); // Convertimos el archivo a base64
        }
    };

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        onLogout();
        setIsOpen(false); // Cerramos el dropdown al cerrar sesión
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
            {/* Botón del avatar */}
            <button
                onClick={toggleDropdown}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease'
                }}
            >
                <Stack spacing={1}>
                    <Avatar src={imagen} sx={{ width: 50, height: 50 }} />
                </Stack>
            </button>

            {/* Dropdown desplegable */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    right: 0,
                    backgroundColor: 'white',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                    borderRadius: '8px',
                    padding: '0.5rem 0',
                    minWidth: '200px',
                    zIndex: 1001,
                    marginTop: '8px',
                    border: '1px solid #eee'
                }}>
                    {/* Información de usuario */}
                    <div style={{
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid #f0f0f0'
                    }}>
                        <Typography variant="body1" fontWeight="600" color="text.primary">
                            {userData.nombre}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" textTransform="capitalize" mt={0.5}>
                            {userData.rol}
                        </Typography>
                    </div>

                    {/* Cambio de imagen */}
                    <Box
                        style={{
                            padding: '0.75rem 1rem',
                            borderBottom: '1px solid #f0f0f0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start'
                        }}
                    >
                        <Typography variant="body2" color="text.secondary" mb={1}>
                            Cambiar avatar:
                        </Typography>
                        <Button
                            variant="contained"
                            component="label"
                            sx={{
                                backgroundColor: '#4CAF50',
                                ':hover': { backgroundColor: '#45A049' },
                                textTransform: 'none',
                            }}
                        >
                            Elegir archivo
                            <input
                                hidden
                                accept="image/*"
                                type="file"
                                onChange={manejarCambioDeImagen}
                            />
                        </Button>
                    </Box>

                    {/* Cerrar sesión */}
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.75rem 1rem',
                            background: 'none',
                            border: 'none',
                            color: '#666',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#f8f9fa';
                            e.target.style.color = '#d9534f';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#666';
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 17L21 12M21 12L16 7M21 12H9M13 16V17C13 18.6569 11.6569 20 10 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H10C11.6569 4 13 5.34315 13 7V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Cerrar sesión
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
