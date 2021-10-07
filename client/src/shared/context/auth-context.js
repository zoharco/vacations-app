import { createContext } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    userId: '',
    token: '',
    userRole: '',
    login: (uid, token, expirationDate, urole) => {},
    logout: () => {}
});