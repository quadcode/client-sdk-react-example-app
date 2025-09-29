import {Button, Container, Paper, Title} from "@mantine/core";
import classes from './Login.page.module.css';
import {useState} from "react";
import {showNotification} from '@mantine/notifications';
import {OAuthMethod} from "@quadcode-tech/client-sdk-js";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);

    console.log(import.meta.env.VITE_OAUTH_APP_REDIRECT_URI)
    const oauth = new OAuthMethod(
        import.meta.env.VITE_TRADING_API_BASE_URL,
        import.meta.env.VITE_OAUTH_APP_CLIENT_ID,
        import.meta.env.VITE_OAUTH_APP_REDIRECT_URI,
        'full' // или 'full offline_access', если нужен refresh token
    );

    const handleLogin = async () => {
        setLoading(true);
        try {
            const {url, codeVerifier} = await oauth.createAuthorizationUrl();
            sessionStorage.setItem("pkce_verifier", codeVerifier);
            window.location.href = url;
        } catch (err) {
            showNotification({
                title: "Login failed",
                message: err instanceof Error ? err.message : "Unknown error",
                color: "red",
            });
            setLoading(false);
        }
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                Welcome to Example!
            </Title>

            <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
                <Button
                    loading={loading}
                    fullWidth
                    radius="md"
                    onClick={handleLogin}
                >
                    Sign in via {import.meta.env.VITE_BRAND_TITLE} account
                </Button>
            </Paper>
        </Container>
    );
}
