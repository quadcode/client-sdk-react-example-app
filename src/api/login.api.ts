import {axiosInstance} from "../lib/axios.ts";

export default async (identifier: string, password: string): Promise<{ ssid: string }> => {
    try {
        await fetch(`${import.meta.env.VITE_TRADING_API_BASE_URL}/v1/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        // ignore any error
    }

    const response = await axiosInstance.post('/api/login', {identifier, password});
    return response.data;
};
