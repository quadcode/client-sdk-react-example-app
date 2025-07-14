import {Outlet, useNavigate} from 'react-router-dom';
import {Box, Button, Flex, Title} from '@mantine/core';
import {SdkProvider} from '../provider/SdkProvider.tsx';
import {AuthProvider} from '../provider/AuthProvider.tsx';

export const AppLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/logout');
    };

    return (
        <Box style={{width: '100%'}}>
            <AuthProvider>
                <SdkProvider>
                    <Flex justify="space-between" align="center" p="md" style={{
                        borderBottom: '1px solid var(--mantine-color-gray-1)',
                    }}>
                        <Title order={3} style={{cursor: 'pointer'}} onClick={() => navigate('/')}>
                            Example App
                        </Title>
                        <Button variant="outline" color="red" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Flex>

                    <Box p="md">
                        <Outlet/>
                    </Box>
                </SdkProvider>
            </AuthProvider>
        </Box>
    );
};
