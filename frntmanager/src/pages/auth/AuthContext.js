import { createContext, useContext, useEffect, useState } from "react";
import {  useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedToken = localStorage.getItem("token");

        if(savedToken){
            setToken(savedToken);
        }
    }, []);

    const login = (token) => {
        localStorage.setItem("token", token);
        setToken(token);
        console.log("TOKEN EXISTE")
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        navigate('/login', { replace: true });
        console.log("TOKEN NAO EXISTE")
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                login,
                logout,
                isAuthenticated: !!token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    return useContext(AuthContext);
}