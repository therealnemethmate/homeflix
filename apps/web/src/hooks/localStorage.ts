import { useState } from 'react';

export const useLocalStorage = (key: string, defaultValue?: string): [string | undefined, (value?: string) => void] => {
    const [storedValue, setStoredValue] = useState<string | undefined>(() => {
        try {
            const value = localStorage.getItem(key);
            if (value) return value;
            if (defaultValue) {
                localStorage.setItem(key, defaultValue);
                return defaultValue;
            }
        } catch (err) {
            return defaultValue;
        }
    });
    const setValue = (value?: string) => {
        try {
            if (!value) return localStorage.removeItem(key);
            localStorage.setItem(key, value);
            setStoredValue(value);
        } catch (err) {
            return;
        }
    };
    
    return [storedValue, setValue];
};
