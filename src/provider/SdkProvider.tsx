import {ReactNode, useRef} from 'react';
import {useEffect, useState} from 'react';
import {ClientSdk, SsidAuthMethod} from '@quadcode-tech/client-sdk-js';
import {SdkContext} from '../context/SdkContext.tsx';
import {useAuth} from '../hooks/useAuth.ts';
import LoadingPage from '../components/LoadingPage.tsx';
import {useNavigate} from 'react-router-dom';

export const SdkProvider = ({children}: { children: ReactNode }) => {
    const [sdk, setSdk] = useState<ClientSdk | null>(null);
    const auth = useAuth();
    const navigate = useNavigate();
    const hasInitializedRef = useRef(false);

    useEffect(() => {
        if (hasInitializedRef.current) {
            return;
        }

        hasInitializedRef.current = true;
        const init = async () => {
            const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('SDK init timeout')), 10000)
            );

            try {
                const sdk = await Promise.race([
                    ClientSdk.create(
                        import.meta.env.VITE_TRADING_WS_API_URL,
                        import.meta.env.VITE_TRADING_PLATFORM_ID,
                        new SsidAuthMethod(auth.ssid),
                        {
                            host: window.location.origin,
                        }
                    ),
                    timeoutPromise,
                ]);

                setSdk(sdk);
            } catch (err) {
                console.error('Failed to initialize SDK:', err);
                navigate('/logout');
            }
        };

        init().catch(console.error);
    }, [auth.ssid, navigate]);

    if (!sdk) return <LoadingPage/>;

    return <SdkContext.Provider value={sdk}>{children}</SdkContext.Provider>;
};
