import '@mantine/core/styles.css';
import {Notifications} from "@mantine/notifications";
import {useRoutes} from "react-router-dom";
import {routes} from "./router/routes.tsx";

export default function App() {
    const element = useRoutes(routes);

    return (
        <>
            <Notifications/>
            {element}
        </>
    );
}
