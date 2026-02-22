export type ThemeType = 'LITE' | 'CLASSIC' | 'MODERN' | 'SIGNATURE' | 'LUXURY' | 'FASTFOOD';

export interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent?: string;
}

export interface ThemeFonts {
    heading: string;
    body: string;
}

export interface ThemeLayout {
    type: 'list' | 'grid' | 'card';
    columns: number; // 1 (mobile) to 4 (desktop)
    gap: string;
}

export interface ThemeConfig {
    name: ThemeType;
    colors: ThemeColors;
    fonts: ThemeFonts;
    layout: ThemeLayout;
    features: {
        showHero: boolean;
        showSearch: boolean;
        showFilters: boolean;
        showImages: boolean;
        enableAnimations: boolean;
    };
}
