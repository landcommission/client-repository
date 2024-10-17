import axios from 'axios';
import { useEffect, createContext, useState } from 'react';

export const UserContext = createContext({});

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!user) {
            axios.get('http://localhost:5000/auth/account').then(({ data }) => {
                setUser(data);
            });
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
