// src/pages/Callback.page.tsx
import {useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {showNotification} from "@mantine/notifications";
import {OAuthMethod} from "@quadcode-tech/client-sdk-js";

export default function CallbackPage() {
    const navigate = useNavigate();
    const ranRef = useRef(false);

    useEffect(() => {
        (async () => {
            if (ranRef.current) return;
            ranRef.current = true;
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");
            const error = params.get("error");
            const errorDescription = params.get("error_description") || undefined;

            if (error) {
                showNotification({
                    title: "Authorization error",
                    message: errorDescription || error,
                    color: "red",
                });
                navigate("/login", {replace: true});
                return;
            }

            if (!code) {
                showNotification({
                    title: "Missing code",
                    message: "В callback не пришёл authorization code",
                    color: "red",
                });
                navigate("/login", {replace: true});
                return;
            }

            const codeVerifier = sessionStorage.getItem("pkce_verifier");
            if (!codeVerifier) {
                showNotification({
                    title: "PKCE error",
                    message: "Не найден PKCE code_verifier. Попробуйте войти заново.",
                    color: "red",
                });
                navigate("/login", {replace: true});
                return;
            }

            try {
                const oauth = new OAuthMethod(
                    import.meta.env.VITE_TRADING_API_PROXY_URL,
                    Number(import.meta.env.VITE_OAUTH_APP_CLIENT_ID),
                    import.meta.env.VITE_OAUTH_APP_REDIRECT_URI,
                    "full" // или 'full offline_access'
                );

                const {accessToken, expiresIn} = await oauth.issueAccessTokenWithAuthCode(code, codeVerifier)

                if (accessToken) {
                    document.cookie = `ssid=${encodeURIComponent(accessToken)}; path=/; max-age=${expiresIn}; SameSite=Strict`;
                }

                showNotification({
                    title: "Signed in",
                    message: "Вы успешно авторизовались",
                    color: "green",
                });

                sessionStorage.removeItem("pkce_verifier");

                window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
                navigate("/", {replace: true});
            } catch (e: unknown) {
                showNotification({
                    title: "Login failed",
                    message: e instanceof Error ? e.message : "Не удалось обменять код на токен",
                    color: "red",
                });
                navigate("/login", {replace: true});
            }
        })();
    }, [navigate]);

    return null;
}
