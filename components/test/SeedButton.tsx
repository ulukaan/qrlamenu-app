
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SeedButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSeed = async () => {
        if (!confirm('This will RESET the entire database! Are you sure?')) return;

        setLoading(true);
        try {
            const res = await fetch('/api/admin/seed', { method: 'POST' });
            if (res.ok) {
                alert('Database seeded successfully!');
                router.refresh();
            } else {
                alert('Failed to seed database.');
            }
        } catch (error) {
            alert('Error connecting to server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button onClick={handleSeed} disabled={loading} variant="destructive">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Reset & Seed Database
        </Button>
    );
}
