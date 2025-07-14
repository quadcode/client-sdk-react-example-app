import {AuthContext} from "../context/AuthContext.tsx";
import {Auth} from "../types/Auth.ts";
import {useContext} from "react";

export const useAuth = (): Auth => {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return auth;
};
