import { Grid, Text, Button, Input } from '@nextui-org/react';
import React from 'react';
import { useAuth } from '../../hooks/auth';

import { login } from './login';

export default function Login() {
    const [username, setUsername] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [error, setError] = React.useState<string | undefined>();
    const auth = useAuth();

    async function handleLogin() {
        try {
            const token = await login(username, password);
            auth.login?.(token);
        } catch (error) {
            setError((error as { message: string })?.message);
        }
    }

    return (
        <>
            <Grid justify="center">
                <Grid.Container gap={5} justify="center">
                    <Text size={'$7xl'} css={{
                        textGradient: '45deg, $blue600 -20%, $purple600 50%',
                    }}>homeflix</Text>
                </Grid.Container>
            </Grid>
            <Grid.Container gap={2} justify="center">
                <Grid lg={10} justify="center">
                    <Text b>welcome!</Text>
                </Grid>
                <Grid lg={10} justify="center">
                    <Input bordered
                        required
                        label='username:'
                        size='lg'
                        onChange={(e) => setUsername(e.target.value)}
                        value={username} />
                </Grid>
                <Grid lg={10} justify="center">
                    <Input bordered
                        required
                        label='password:'
                        type={'password'}
                        size='lg'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password} />
                </Grid>
                <Grid lg={10} justify="center">
                    <Button color={'secondary'} onPress={handleLogin}>Login</Button>
                </Grid>
                {error && (
                    <Grid lg={10} justify="center">
                        <Text color='red'>{error}</Text>
                    </Grid>)
                }
            </Grid.Container>
        </>
    );
}
