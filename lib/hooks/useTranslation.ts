"use client";

import { useState, useEffect } from 'react';
import tr from '@/locales/tr.json';
import en from '@/locales/en.json';

const dictionaries: any = { tr, en };

export function useTranslation() {
    const [lang, setLang] = useState('tr');

    useEffect(() => {
        // Simple logic to persist or detect language
        const savedLang = localStorage.getItem('app-lang');
        if (savedLang && dictionaries[savedLang]) {
            setLang(savedLang);
        } else {
            const browserLang = navigator.language.split('-')[0];
            if (dictionaries[browserLang]) {
                setLang(browserLang);
            }
        }
    }, []);

    const t = (key: string) => {
        const keys = key.split('.');
        let result = dictionaries[lang];

        for (const k of keys) {
            if (result && result[k]) {
                result = result[k];
            } else {
                return key; // Fallback to key name
            }
        }

        return result;
    };

    const changeLanguage = (newLang: string) => {
        if (dictionaries[newLang]) {
            setLang(newLang);
            localStorage.setItem('app-lang', newLang);
        }
    };

    return { t, lang, changeLanguage };
}
