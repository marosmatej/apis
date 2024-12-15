import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvide = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null); // Store full user data
    const [loading, setLoading] = useState(true);

    const loginUser = async (username, password) => {
        try {
            console.log("Sending login request...");
            const response = await fetch(
                "https://bookstorebackendapis.azurewebsites.net/api/auth/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                }
            );

            console.log("Response received:", response);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Response data:", data);

            if (data.token) {
                // Save token and user data to localStorage
                localStorage.setItem("authToken", data.token);
                localStorage.setItem(
                    "userInfo",
                    JSON.stringify(data.user) // Save user object
                );

                // Update current user state
                setCurrentUser(data.user);
            } else {
                throw new Error(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => {
        // Clear user and token from localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("userInfo");
        setCurrentUser(null);
    };

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const userInfo = localStorage.getItem("userInfo");

        if (token && userInfo) {
            setCurrentUser(JSON.parse(userInfo)); // Restore user data
        }
        setLoading(false);
    }, []);

    const value = {
        currentUser, // This now contains `id` and `username`
        loading,
        loginUser,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
