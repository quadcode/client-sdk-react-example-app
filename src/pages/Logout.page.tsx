import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import LoadingPage from "../components/LoadingPage.tsx";

export default function LogoutPage() {
    const navigate = useNavigate();

    useEffect(() => {
        document.cookie = 'ssid=; path=/; max-age=0; SameSite=Strict';

        setTimeout(() => {
            navigate('/login');
        }, 300); // 0.3 сек
    }, [navigate]);

    return (
        <LoadingPage/>
    );
}
