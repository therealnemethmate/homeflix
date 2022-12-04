import { Button, Grid, Input, Table, Text } from '@nextui-org/react';
import { useState } from 'react';
import { Torrent } from '../../common/interfaces';
import { useAuth } from '../../hooks/auth';
import { fetchTorrents, downloadTorrent } from './torrent';

export default function Torrents() {
    const [torrents, setTorrents] = useState<Torrent[] | undefined>();
    const [searchText, setSearchText] = useState<string | undefined>();
    const auth = useAuth();

    function handleSearch() {
        if (!auth.token) return auth.logout?.();
        if (!searchText) return;
        fetchTorrents(auth.token, searchText).then(setTorrents);
    }

    function handleDownload(id: string) {
        if (!auth.token) return auth.logout?.();
        downloadTorrent(auth.token, id);
    }

    return (
        <>
            <Grid.Container gap={2} justify="center">
                <Grid justify="center">
                    <Text size={'$7xl'} css={{
                        textGradient: '45deg, $blue600 -20%, $purple600 50%',
                    }}>homeflix</Text>
                </Grid>
            </Grid.Container>
            <Grid.Container gap={2} justify="center">
                <Grid justify="center">
                    <Text size={'$5xl'} css={{
                        textGradient: '45deg, $blue600 -20%, $purple600 50%',
                    }}>torrents</Text>
                </Grid>
            </Grid.Container>
            <Grid.Container gap={2} justify="center">
                <Grid lg={10} justify="center">
                    <Input bordered
                        required
                        label='Search in torrents for:'
                        size='lg'
                        onChange={(e) => setSearchText(e.target.value)} />

                </Grid>
                <Grid lg={10} justify="center">
                    <Button color={'secondary'} onPress={handleSearch}>Search</Button>
                </Grid>
            </Grid.Container>
            {torrents && (
                <Grid.Container gap={2} justify="center">
                    <Grid justify="center">
                        <Table bordered
                            aria-label="Torrents"
                            color="primary"
                            css={{
                                height: 'auto',
                                padding: '1rem',
                                minWidth: '100%',
                            }}
                        >
                            <Table.Header>
                                <Table.Column key="id">id</Table.Column>
                                <Table.Column key="title">title</Table.Column>
                                <Table.Column key="peers">peers</Table.Column>
                                <Table.Column key="createdAt">created at</Table.Column>
                                <Table.Column key="download">actions</Table.Column>
                            </Table.Header>
                            <Table.Body items={torrents} loadingState={!torrents?.length ? 'loading' : undefined}>
                                {(torrent) => (
                                    <Table.Row key={torrent.id}>
                                        <Table.Cell>{torrent.id}</Table.Cell>
                                        <Table.Cell>{torrent.title}</Table.Cell>
                                        <Table.Cell>{torrent.peers}</Table.Cell>
                                        <Table.Cell>{torrent.createdAt.toLocaleString()}</Table.Cell>
                                        <Table.Cell>
                                            <Button onPress={() => handleDownload(torrent.id)} size={'xs'}>
                                                Download
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </Grid>
                </Grid.Container>
            )})
        </>
    );
}
