import {RouteObject} from 'react-router-dom';
import HomePage from "../pages/Home.page.tsx";
import LoginPage from "../pages/Login.page.tsx";
import LogoutPage from "../pages/Logout.page.tsx";
import {PrivateRoute} from "./PrivateRoute.tsx";
import {AppLayout} from "../layout/AppLayout.tsx";

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
