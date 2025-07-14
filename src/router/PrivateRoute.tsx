import {Navigate, Outlet} from 'react-router-dom';
import {getCookie} from "../utils/cookie.ts";

export const PrivateRoute = () => {
    const ssid = getCookie("ssid");

    if (!ssid) {
        return <Navigate to="/login" replace/>;
    }

    return <Outlet/>;
};
