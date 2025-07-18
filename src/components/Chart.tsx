import {useEffect, useRef} from 'react';
import {CandlestickSeries, createChart, UTCTimestamp} from 'lightweight-charts';
import {useSdk} from '../hooks/useSdk.ts';
import {Candle} from '@quadcode-tech/client-sdk-js';

interface ChartProps {
    activeId: number;
    candleSize: number;
    chartHeight?: number;
    chartMinutesBack?: number;
}

export function Chart({activeId, candleSize, chartHeight = 400, chartMinutesBack = 60}: ChartProps) {
    const sdk = useSdk();
    const containerRef = useRef<HTMLDivElement>(null);
    const earliestLoadedRef = useRef<number | null>(null);
    const fetchingRef = useRef<boolean>(false);

    useEffect(() => {
        let isMounted = true;
        if (!sdk || !containerRef.current) return;

        const chart = createChart(containerRef.current, {
            layout: {textColor: 'black'},
            height: chartHeight,
        });

        const series = chart.addSeries(CandlestickSeries);

        const initChart = async () => {
            const chartLayer = await sdk.realTimeChartDataLayer(activeId, candleSize);
            const from = Math.floor(Date.now() / 1000) - chartMinutesBack * 60;
            const candles = await chartLayer.fetchAllCandles(from);
            if (!isMounted) return;

            const format = (cs: Candle[]) => cs.map((c) => ({
                time: c.from as UTCTimestamp,
                open: c.open,
                high: c.max,
                low: c.min,
                close: c.close,
            }));

            series.setData(format(candles));

            if (candles.length > 0) {
                earliestLoadedRef.current = candles[0].from as number;
            }

            chartLayer.subscribeOnLastCandleChanged((candle) => {
                if (!isMounted) return;
                series.update({
                    time: candle.from as UTCTimestamp,
                    open: candle.open,
                    high: candle.max,
                    low: candle.min,
                    close: candle.close,
                });
            });

            chartLayer.subscribeOnConsistencyRecovered(() => {
                if (!isMounted) return;
                const all = chartLayer.getAllCandles();
                series.setData(format(all));
            });

            chart.timeScale().subscribeVisibleTimeRangeChange((range) => {
                if (!range || !earliestLoadedRef.current || fetchingRef.current || !isMounted) return;

                if ((range.from as number) <= earliestLoadedRef.current) {
                    fetchingRef.current = true;
                    const fetchFrom = earliestLoadedRef.current - chartMinutesBack * 60;

                    chartLayer.fetchAllCandles(fetchFrom).then((moreData) => {
                        if (!isMounted) return;
                        const formatted = format(moreData);

                        series.setData(formatted);
                        if (formatted.length > 0) {
                            earliestLoadedRef.current = formatted[0].time;
                        }
                    }).finally(() => {
                        fetchingRef.current = false;
                    });
                }
            });
        };

        initChart().then()

        return () => {
            isMounted = false;
            chart.remove();
        };
    }, [sdk, containerRef, activeId, candleSize, chartHeight, chartMinutesBack]);

    return <div ref={containerRef} style={{width: '100%', height: chartHeight}}/>;
}
