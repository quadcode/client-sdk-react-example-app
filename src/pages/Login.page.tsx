import {useForm} from '@mantine/form';
import {Button, Container, Paper, PasswordInput, TextInput, Title} from "@mantine/core";
import classes from './Login.page.module.css';
import loginApi from "../api/login.api.ts";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {showNotification} from '@mantine/notifications';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: '',
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        setLoading(true);

        try {
            const {ssid} = await loginApi(values.email, values.password);
            document.cookie = `ssid=${encodeURIComponent(ssid)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
            showNotification({
                title: 'Login successful',
                message: 'Welcome back 👋',
                color: 'green',
            });

            navigate('/'); // redirect to homepage
        } catch (err: unknown) {
            if (err instanceof Error) {
                showNotification({
                    title: 'Login failed',
                    message: err.message || 'Invalid email or password',
                    color: 'red',
                });
            } else {
                showNotification({
                    title: 'Login failed',
                    message: 'An unknown error occurred',
                    color: 'red',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size={420} my={40}>
            <Title ta="center" className={classes.title}>
                Welcome to Example!
            </Title>

            <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput label="Email"
                               placeholder="you@mantine.dev"
                               required
                               radius="md"
                               key={form.key('email')}
                               {...form.getInputProps('email')}
                    />
                    <PasswordInput label="Password"
                                   placeholder="Your password"
                                   key={form.key('password')}
                                   {...form.getInputProps('password')}
                                   required mt="md" radius="md"
                    />
                    <Button loading={loading} fullWidth mt="xl" radius="md" type="submit">
                        Sign in
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}
