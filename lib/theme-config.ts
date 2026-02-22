import { ThemeConfig } from '@/types/theme';

export const THEMES: Record<string, ThemeConfig> = {
    LITE: {
        name: 'LITE',
        colors: {
            primary: '#ff7a21', // Varsayılan Turuncu
            secondary: '#ffffff',
            background: '#ffffff',
            text: '#212529',
        },
        fonts: {
            heading: 'Inter, sans-serif',
            body: 'Inter, sans-serif',
        },
        layout: {
            type: 'list',
            columns: 1,
            gap: '12px',
        },
        features: {
            showHero: false,
            showSearch: true,
            showFilters: false,
            showImages: false,
            enableAnimations: false,
        },
    },
    CLASSIC: {
        name: 'CLASSIC',
        colors: {
            primary: '#2c3e50', // Lacivert
            secondary: '#ecf0f1', // Açık Gri
            background: '#f8f9fa',
            text: '#34495e',
        },
        fonts: {
            heading: '"Manrope", sans-serif',
            body: '"Inter", sans-serif',
        },
        layout: {
            type: 'grid',
            columns: 2,
            gap: '16px',
        },
        features: {
            showHero: true,
            showSearch: true,
            showFilters: true,
            showImages: true,
            enableAnimations: true,
        },
    },
    MODERN: {
        name: 'MODERN',
        colors: {
            primary: '#6366f1', // Indigo
            secondary: '#1e293b', // Slate 800
            background: '#0f172a', // Slate 900 (Dark Mode Base)
            text: '#f8fafc', // Slate 50
            accent: '#818cf8'
        },
        fonts: {
            heading: '"Plus Jakarta Sans", sans-serif',
            body: '"DM Sans", sans-serif',
        },
        layout: {
            type: 'card',
            columns: 1, // Large Cards
            gap: '24px',
        },
        features: {
            showHero: true,
            showSearch: true,
            showFilters: true,
            showImages: true,
            enableAnimations: true, // + Micro interactions
        },
    },
    SIGNATURE: {
        name: 'SIGNATURE',
        colors: {
            primary: '#1a1a1b',
            secondary: '#ffffff',
            background: '#ffffff',
            text: '#1a1a1b',
            accent: '#ff7a21'
        },
        fonts: {
            heading: '"Outfit", sans-serif',
            body: '"Inter", sans-serif',
        },
        layout: {
            type: 'list',
            columns: 1,
            gap: '24px',
        },
        features: {
            showHero: true,
            showSearch: true,
            showFilters: true,
            showImages: true,
            enableAnimations: true,
        },
    },
    LUXURY: {
        name: 'LUXURY',
        colors: {
            primary: '#d4af37', // Gold
            secondary: '#1a1a1a', // Rich Black
            background: '#0a0a0a',
            text: '#fdfcf0',
            accent: '#ffffff'
        },
        fonts: {
            heading: '"Playfair Display", serif',
            body: '"Montserrat", sans-serif',
        },
        layout: {
            type: 'list',
            columns: 1,
            gap: '48px',
        },
        features: {
            showHero: true,
            showSearch: false,
            showFilters: true,
            showImages: true,
            enableAnimations: true,
        },
    },
    FASTFOOD: {
        name: 'FASTFOOD',
        colors: {
            primary: '#e11d48', // Red
            secondary: '#fbbf24', // Yellow
            background: '#ffffff',
            text: '#1e293b',
            accent: '#ef4444'
        },
        fonts: {
            heading: '"Bangers", cursive',
            body: '"Inter", sans-serif',
        },
        layout: {
            type: 'grid',
            columns: 2,
            gap: '16px',
        },
        features: {
            showHero: true,
            showSearch: true,
            showFilters: true,
            showImages: true,
            enableAnimations: true,
        },
    }
};

export const DEFAULT_THEME = THEMES.LITE;

export function getThemeConfig(themeName: string): ThemeConfig {
    return THEMES[themeName] || DEFAULT_THEME;
}
