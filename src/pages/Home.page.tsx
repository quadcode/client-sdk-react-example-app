import {Chart} from '../components/Chart';
import {Flex, Select} from "@mantine/core";
import {useEffect, useState} from "react";
import {useSdk} from "../hooks/useSdk.ts";
import {Active} from "../types/Active.ts";

const candleSizes = [
    1, 5, 10, 15, 30, 60, 120, 300, 600, 900,
    1800, 3600, 7200, 14400, 28800, 43200,
    86400, 604800, 2592000,
];

export default function HomePage() {
    const sdk = useSdk();
    const [actives, setActives] = useState<Active[]>([]);
    const [selectedActiveId, setSelectedActiveId] = useState<string | null>(null);
    const [selectedCandleSize, setSelectedCandleSize] = useState<string | null>('10'); // default 1 min

    useEffect(() => {
        if (!sdk) return;

        const init = async () => {
            const now = sdk.currentTime();
            const blitzOptions = await sdk.blitzOptions();
            const blitzOptionsActives = blitzOptions.getActives()
                .filter((a) => a.canBeBoughtAt(now))
                .map((a) => ({
                    id: a.id,
                    title: a.ticker ?? `Active ${a.id}`,
                }));

            setActives(blitzOptionsActives);
            if (blitzOptionsActives.length > 0) {
                setSelectedActiveId(String(blitzOptionsActives[0].id));
            }
        };

        init().then();
    }, [sdk]);

    return (
        <Flex>
            <Flex direction="column" miw="80%">
                {selectedActiveId && selectedCandleSize && (
                    <Chart
                        activeId={parseInt(selectedActiveId)}
                        candleSize={parseInt(selectedCandleSize)}
                        chartHeight={400}
                        chartMinutesBack={parseInt(selectedCandleSize) * 120}
                    />
                )}
            </Flex>

            <Flex p={10} direction="column" gap="sm">
                <Select
                    label="Active"
                    placeholder="Choose an active"
                    value={selectedActiveId}
                    onChange={setSelectedActiveId}
                    data={actives.map((a) => ({
                        value: String(a.id),
                        label: a.title ?? `Active ${a.id}`,
                    }))}
                />

                <Select
                    label="Candle Size (sec)"
                    placeholder="Choose candle size"
                    value={selectedCandleSize}
                    onChange={setSelectedCandleSize}
                    data={candleSizes.map((s) => ({
                        value: String(s),
                        label: `${s} sec`,
                    }))}
                />
            </Flex>
        </Flex>
    );
}
