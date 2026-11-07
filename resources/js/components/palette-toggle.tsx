import { Leaf, Palette as PaletteIcon, SwatchBook } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { usePalette, type Palette } from '@/hooks/use-palette';
import { cn } from '@/lib/utils';

const palettes: Record<Palette, { icon: typeof PaletteIcon; label: string }> = {
    steel: { icon: SwatchBook, label: 'Steel palette' },
    terracotta: { icon: PaletteIcon, label: 'Terracotta palette' },
    forest: { icon: Leaf, label: 'Forest palette' },
};

const order: Palette[] = ['steel', 'terracotta', 'forest'];

export default function PaletteToggle({
    className = '',
    ...props
}: HTMLAttributes<HTMLButtonElement>) {
    const { palette, updatePalette } = usePalette();

    const next = order[(order.indexOf(palette) + 1) % order.length];
    const Icon = palettes[next].icon;
    const label = `Switch to ${palettes[next].label.toLowerCase()}`;

    return (
        <button
            type="button"
            onClick={() => updatePalette(next)}
            aria-label={label}
            title={label}
            className={cn(
                'flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none',
                className,
            )}
            {...props}
        >
            <Icon className="size-4" />
        </button>
    );
}
