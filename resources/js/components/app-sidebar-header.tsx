import { Moon, Sun } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { resolvedAppearance, updateAppearance } = useAppearance();

    const nextMode = resolvedAppearance === 'dark' ? 'light' : 'dark';
    const ThemeIcon = resolvedAppearance === 'dark' ? Moon : Sun;
    const nextLabel =
        nextMode === 'light' ? 'Switch to light mode' : 'Switch to dark mode';

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/50 bg-background/80 px-6 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 text-muted-foreground" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-3">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            onClick={() => updateAppearance(nextMode)}
                            aria-label={nextLabel}
                            className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                            <ThemeIcon className="size-4" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>{nextLabel}</TooltipContent>
                </Tooltip>
            </div>
        </header>
    );
}
