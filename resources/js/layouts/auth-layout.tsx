import { Link } from '@inertiajs/react';
import { Home } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

/**
 * Authentication layout.
 *
 * A split screen: a dark brand panel on the left, and the auth form on a
 * light card surface on the right. The `.homecredit` class applies the app
 * design tokens (steel-blue palette + typefaces) so components inside inherit
 * the correct look.
 */
export default function AuthLayout({
    children,
    title = '',
    description = '',
}: AuthLayoutProps) {
    return (
        <div className="homecredit grid min-h-svh bg-background lg:grid-cols-[minmax(0,26rem)_1fr]">
            {/* ============ Brand panel (desktop) ============ */}
            <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-sidebar-border bg-sidebar p-8 text-sidebar-foreground lg:flex xl:p-10">
                {/* subtle radial glow on the dark surface */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-60"
                    style={{
                        background:
                            'radial-gradient(120% 80% at 0% 0%, color-mix(in oklab, var(--sidebar-primary) 22%, transparent), transparent 60%)',
                    }}
                />

                {/* Brand mark */}
                <Link
                    href={home()}
                    className="relative z-10 flex items-center gap-3"
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
                        <Home
                            className="size-5 text-sidebar-primary-foreground"
                            strokeWidth={2.25}
                        />
                    </div>
                    <span className="flex flex-col leading-none">
                        <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
                            Home Credit
                        </span>
                        <span className="mt-1 text-[10px] font-medium tracking-widest text-sidebar-foreground/40 uppercase">
                            Home &amp; Credit
                        </span>
                    </span>
                </Link>

                {/* Tagline */}
                <div className="relative z-10 flex flex-col gap-4">
                    <h2 className="max-w-xs text-2xl leading-snug font-bold tracking-tight text-sidebar-foreground">
                        Documents in. Credit out.
                    </h2>
                    <p className="max-w-xs text-sm text-sidebar-foreground/60">
                        Share your home documents and we&apos;ll run the steps
                        that get you approved for bank credit.
                    </p>
                </div>

                {/* Footer */}
                <div className="relative z-10 flex items-center gap-2 text-[11px] text-sidebar-foreground/40">
                    <span className="size-1.5 rounded-full bg-success" />
                    All systems operational
                </div>
            </aside>

            {/* ============ Auth form ============ */}
            <main className="flex min-h-svh items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-sm">
                    {/* Mobile brand mark (panel is hidden below lg) */}
                    <Link
                        href={home()}
                        className="mb-8 flex items-center gap-3 lg:hidden"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
                            <Home
                                className="size-5 text-primary-foreground"
                                strokeWidth={2.25}
                            />
                        </div>
                        <span className="flex flex-col leading-none">
                            <span className="text-sm font-bold tracking-tight">
                                Home Credit
                            </span>
                            <span className="mt-1 text-[10px] font-medium tracking-widest text-muted-foreground/50 uppercase">
                                Home &amp; Credit
                            </span>
                        </span>
                    </Link>

                    <div className="mb-8 space-y-2 text-center lg:text-left">
                        <h1 className="text-xl font-bold tracking-tight">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>

                    {children}
                </div>
            </main>
        </div>
    );
}
