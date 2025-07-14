import {Flex, Loader} from '@mantine/core';

export default function LoadingPage() {
    return (
        <Flex w='100%' h='100vh' display='flex' justify='center' align='center'>
            <Loader/>
        </Flex>
    );
}
