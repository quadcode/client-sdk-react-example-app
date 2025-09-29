import {RouteObject} from 'react-router-dom';
import HomePage from "../pages/Home.page.tsx";
import LoginPage from "../pages/Login.page.tsx";
import LogoutPage from "../pages/Logout.page.tsx";
import {PrivateRoute} from "./PrivateRoute.tsx";
import {AppLayout} from "../layout/AppLayout.tsx";
import CallbackPage from "../pages/Callback.page.tsx";

export const routes: RouteObject[] = [
    {
        path: '/login',
        element: <LoginPage/>,
    },
    {
        path: '/logout',
        element: <LogoutPage/>,
    },
    {
        path: '/oauth/callback',
        element: <CallbackPage/>,
    },
    {
        path: '/',
        element: <PrivateRoute/>,
        children: [
            {
                element: <AppLayout/>,
                children: [
                    {
                        path: '/',
                        element: <HomePage/>,
                    },
                ],
            },
        ],
    },
];
