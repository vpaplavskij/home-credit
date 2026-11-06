import { useSyncExternalStore } from 'react';

export type Palette = 'steel' | 'terracotta' | 'forest';

export type UsePaletteReturn = {
    readonly palette: Palette;
    readonly updatePalette: (palette: Palette) => void;
};

const listeners = new Set<() => void>();
let currentPalette: Palette = 'steel';

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

const getStoredPalette = (): Palette => {
    if (typeof window === 'undefined') {
        return 'steel';
    }

    const stored = localStorage.getItem('palette');

    return stored === 'terracotta' || stored === 'forest' || stored === 'steel'
        ? stored
        : 'steel';
};

const applyPalette = (palette: Palette): void => {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.dataset.palette = palette;
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => listeners.forEach((listener) => listener());

export function initializePalette(): void {
    if (typeof window === 'undefined') {
        return;
    }

    currentPalette = getStoredPalette();
    applyPalette(currentPalette);
}

export function usePalette(): UsePaletteReturn {
    const palette: Palette = useSyncExternalStore(
        subscribe,
        () => currentPalette,
        () => 'steel',
    );

    const updatePalette = (next: Palette): void => {
        currentPalette = next;

        // Store in localStorage for client-side persistence...
        localStorage.setItem('palette', next);

        // Store in cookie for SSR...
        setCookie('palette', next);

        applyPalette(next);
        notify();
    };

    return { palette, updatePalette } as const;
}
