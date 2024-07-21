import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();
const initialState = {
    user: null,
    isAuthenticated: false,
}
function reducer(state, action) {
    switch (action.type) {
        case 'login':
            return {
                ...state, isAuthenticated: true, user: action.payload
            };
        case 'logout':
            return {
                ...state, isAuthenticated: false, user: null
            };
        default:
            throw new Error('Unknown action type');
    }
}

const FAKE_USER = {
    name: "Jack",
    email: "jack@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz",
};

function AuthProvider({ children }) {
    const [{ user, isAuthenticated }, dispatch] = useReducer(reducer, initialState);

    function login(email, password) {
        if (FAKE_USER.email === email && FAKE_USER.password === password)
            dispatch({ type: "login", payload: FAKE_USER });
    }
    function logout() {
        dispatch({ type: "logout" });
    }
    return <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
        {children}
    </AuthContext.Provider>
}

function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error("AuthContext was used outside the AuthProvider");
    return context;
}

export { AuthProvider, useAuth };

