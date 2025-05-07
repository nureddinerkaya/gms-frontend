import React, {createContext, useState, useContext, useEffect} from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8000/api/users/checkuser', {
                username: username,
                password: password
            });

            if (response.data.status !== "success") {
                throw new Error("Invalid credentials");
            } else {
                alert("Login successful!");
                return true;
            }

        } catch (error) {
            console.error("Login Error:", error);
            alert("Login failed. Please check your credentials.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{user, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};