import type {ReactNode} from 'react';
import {useEffect, useState} from 'react';
import {Auth} from "../types/Auth.ts";
import {AuthContext} from "../context/AuthContext.tsx";
import {getCookie} from "../utils/cookie.ts";
import LoadingPage from "../components/LoadingPage.tsx";

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [auth, setAuth] = useState<Auth | null>({} as Auth);

    useEffect(() => {
        const ssid = getCookie('ssid')

        if (!ssid) {
            return;
        }

        setAuth({
            ssid: ssid,
        })
    }, []);

    if (!auth || !auth.ssid) {
        return <LoadingPage/>
    }

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
