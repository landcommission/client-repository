import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const { REACT_APP_BACKEND_URL } = process.env;

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: localStorage.getItem('token'),
        isAuthenticated: null,
        loading: true,
        user: null,
    });

    useEffect(() => {
        const checkAuthStatus = async () => {
            if (authState.token) {
                try {
                    const res = await axios.get(`${REACT_APP_BACKEND_URL}/auth/status`, {
                        headers: {
                            'x-auth-token': authState.token,
                        },
                    });
                    setAuthState(prevState => ({
                        ...prevState,
                        isAuthenticated: res.data.isAuthenticated,
                        loading: false,
                        user: res.data.user, // Assuming the response includes user data
                    }));
                } catch (err) {
                    console.error(err);
                    setAuthState(prevState => ({
                        ...prevState,
                        isAuthenticated: false,
                        loading: false,
                    }));
                }
            } else {
                setAuthState(prevState => ({
                    ...prevState,
                    isAuthenticated: false,
                    loading: false,
                }));
            }
        };

        checkAuthStatus();
    }, [authState.token]); // Only depend on authState.token

    const login = (token, user) => {
        localStorage.setItem('token', token);
        // console.log('User;', token)
        setAuthState({
            token,
            isAuthenticated: true,
            loading: false,
            user,
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthState({
            token: null,
            isAuthenticated: false,
            loading: false,
            user: null,
        });
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider };
