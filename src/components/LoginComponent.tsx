// LoginComponent.jsx (Ejemplo de un componente de login)
import React, { useState } from 'react';
import axios from '../api/axios'; // El axios con Interceptor
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const LoginComponent = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Llama a la ruta de login del backend
            const response = await axios.post('/users/login', { email, password });
            
            // 🚨 RECUPERACIÓN CRUCIAL DE DATOS DEL LOGIN
            const { _id, token } = response.data; 

            // Llama a la función corregida de AuthContext con ambos datos
            login(_id, token); 

            toast.success('¡Inicio de sesión exitoso!');
            // Redirigir o actualizar la UI aquí
        } catch (error) {
            console.error('Error de login:', error);
            toast.error('Credenciales inválidas o error de red.');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            {/* Campos de email y password */}
            <button type="submit">Iniciar Sesión</button>
        </form>
    );
};

export default LoginComponent;