import { Head } from '@inertiajs/react';
import {
    ArrowUpRight,
    Building2,
    CalendarDays,
    CheckCircle2,
    Home,
    MapPin,
    Ruler,
    ShieldCheck,
    Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const details = [
    { icon: MapPin, label: 'Address', value: '12 Rosewood Lane, Springfield' },
    { icon: Ruler, label: 'Size', value: '186 m² · 4 beds · 2 baths' },
    { icon: CalendarDays, label: 'Purchased', value: 'March 2023' },
    { icon: Users, label: 'Owners', value: 'Anna & Ben Kovač' },
];

const checklist = [
    { label: 'Ownership verified', done: true },
    { label: 'Mortgage status confirmed', done: true },
    { label: 'Valuation on file', done: true },
    { label: 'Utility bills (3 months)', done: false },
];

export default function MyHome() {
    return (
        <>
            <Head title="My Home" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Property hero */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-11 items-center justify-center rounded-lg bg-sidebar-primary/10">
                                    <Home
                                        className="size-5 text-sidebar-primary"
                                        strokeWidth={2.25}
                                    />
                                </div>
                                <div>
                                    <CardTitle>Rosewood Residence</CardTitle>
                                    <CardDescription className="mt-0.5 flex items-center gap-1">
                                        <MapPin className="size-3.5" />
                                        12 Rosewood Lane, Springfield
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge
                                variant="secondary"
                                className="hidden font-mono text-[11px] sm:inline-flex"
                            >
                                PROPERTY #HC-0042
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-3">
                        <Button size="sm" variant="outline">
                            <Building2 />
                            Edit property
                        </Button>
                        <Button size="sm" variant="ghost">
                            View valuation
                            <ArrowUpRight className="size-4" />
                        </Button>
                    </CardContent>
                </Card>

                {/* Details + checklist */}
                <div className="grid auto-rows-min gap-4 lg:grid-cols-2">
                    <Card className="gap-0 py-5">
                        <CardHeader className="px-5">
                            <CardTitle className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                                Property details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 px-5">
                            {details.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-center gap-3"
                                >
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/40">
                                        <item.icon className="size-4 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-muted-foreground">
                                            {item.label}
                                        </p>
                                        <p className="truncate text-sm font-medium">
                                            {item.value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="gap-0 py-5">
                        <CardHeader className="flex-row items-center justify-between space-y-0 px-5">
                            <CardTitle className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                                Approval checklist
                            </CardTitle>
                            <Badge
                                variant="secondary"
                                className="font-mono text-[11px]"
                            >
                                3/4
                            </Badge>
                        </CardHeader>
                        <CardContent className="space-y-1 px-5 pt-2">
                            {checklist.map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/40"
                                >
                                    {item.done ? (
                                        <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                                    ) : (
                                        <span className="size-4 shrink-0 rounded-full border-2 border-border" />
                                    )}
                                    <span
                                        className={
                                            item.done
                                                ? 'text-sm text-muted-foreground line-through'
                                                : 'text-sm font-medium'
                                        }
                                    >
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Valuation */}
                <Card id="valuation" className="gap-0 py-5">
                    <CardHeader className="flex-row items-center justify-between space-y-0 px-5">
                        <div>
                            <CardTitle className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                                Estimated valuation
                            </CardTitle>
                            <p className="mt-2 font-mono text-3xl font-semibold tracking-tight">
                                $486,000
                            </p>
                        </div>
                        <Badge
                            variant="secondary"
                            className="hidden items-center gap-1.5 sm:inline-flex"
                        >
                            <ShieldCheck className="size-3.5 text-emerald-500" />
                            Verified Jan 2026
                        </Badge>
                    </CardHeader>
                    <Separator className="bg-border/60" />
                    <CardContent className="grid gap-4 px-5 sm:grid-cols-3">
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Market range
                            </p>
                            <p className="font-mono text-sm font-medium">
                                $452,000 – $512,000
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Per square meter
                            </p>
                            <p className="font-mono text-sm font-medium">
                                $2,613 / m²
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Comparable homes
                            </p>
                            <p className="font-mono text-sm font-medium">
                                7 in 0.5 km radius
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

MyHome.layout = {
    breadcrumbs: [
        {
            title: 'My Home',
            href: '/my-home',
        },
    ],
};
