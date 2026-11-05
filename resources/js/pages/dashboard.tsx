import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    FileText,
    Home,
    Landmark,
    ShieldCheck,
    Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { index as documents } from '@/routes/documents';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dashboard, myHome } from '@/routes';

const highlights = [
    {
        label: 'Credit readiness',
        value: '—',
        hint: 'Calculated once your home profile is complete.',
        icon: ShieldCheck,
    },
    {
        label: 'Documents on file',
        value: '0',
        hint: 'Upload deeds, valuations and income proof here.',
        icon: FileText,
    },
    {
        label: 'Next step',
        value: 'Add your home',
        hint: 'Start by telling us about the property you own.',
        icon: Home,
    },
];

const steps = [
    {
        stage: 'Step 1',
        title: 'Register your home',
        description: 'Tell us about the property you own so we can assess it.',
        href: myHome(),
        icon: Home,
        done: false,
    },
    {
        stage: 'Step 2',
        title: 'Upload documents',
        description: 'Add deeds, valuations and income proof to your file.',
        href: documents(),
        icon: Upload,
        done: false,
    },
    {
        stage: 'Step 3',
        title: 'Documents on file',
        description: 'Everything a bank needs, stored securely in one place.',
        href: documents(),
        icon: FileText,
        done: false,
    },
    {
        stage: 'Outcome',
        title: 'Credit approval',
        description: 'Your credit readiness, ready for bank approval.',
        href: dashboard(),
        icon: Landmark,
        done: false,
    },
];

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Welcome */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <CardTitle>Welcome to Home Credit</CardTitle>
                                <CardDescription className="mt-1">
                                    Share your home documents and we&apos;ll run
                                    the steps that get you approved for bank
                                    credit.
                                </CardDescription>
                            </div>
                            <Badge
                                variant="secondary"
                                className="hidden font-mono text-[11px] sm:inline-flex"
                            >
                                ACCOUNT #0042
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-3">
                        <Button asChild size="sm">
                            <Link href={myHome()} prefetch>
                                Add my home
                            </Link>
                        </Button>
                        <Button asChild size="sm" variant="outline">
                            <Link href={documents()} prefetch>
                                Upload documents
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Highlights */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {highlights.map((item) => (
                        <Card key={item.label} className="gap-0 py-5">
                            <CardHeader className="flex-row items-center justify-between space-y-0 px-5">
                                <CardTitle className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                                    {item.label}
                                </CardTitle>
                                <item.icon className="size-4 text-primary" />
                            </CardHeader>
                            <CardContent className="px-5">
                                <div className="font-mono text-2xl font-semibold tracking-tight">
                                    {item.value}
                                </div>
                                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                    {item.hint}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Project scheme */}
                <Card className="flex-1">
                    <div className="flex h-full flex-col gap-6 px-6 pb-0">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-base">
                                    How Home Credit works
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    The path from your property to bank credit
                                    approval.
                                </CardDescription>
                            </div>
                            <Badge
                                variant="secondary"
                                className="hidden shrink-0 font-mono text-[11px] sm:inline-flex"
                            >
                                {steps.filter((step) => step.done).length}/
                                {steps.length} complete
                            </Badge>
                        </div>

                        <ol className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
                            {steps.map((step, index) => (
                                <li
                                    key={step.title}
                                    className="flex min-w-0 flex-1 items-center gap-3 lg:flex-col lg:gap-4 lg:p-1"
                                >
                                    <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-border/70 bg-card p-3 transition-colors hover:border-primary/40 lg:flex-col lg:items-center lg:text-center">
                                        <div className="relative flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-xs">
                                            <step.icon className="size-5 text-primary" />
                                            <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary font-mono text-[11px] font-semibold text-primary-foreground">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                                                {step.stage}
                                            </p>
                                            <Link
                                                href={step.href}
                                                prefetch
                                                className="mt-0.5 block text-sm font-medium underline-offset-4 hover:underline"
                                            >
                                                {step.title}
                                            </Link>
                                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <span
                                            className="flex size-6 shrink-0 items-center justify-center text-muted-foreground/70"
                                            aria-hidden
                                        >
                                            <ArrowRight className="size-4 rotate-90 lg:rotate-0" />
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ol>

                        <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
                            <BadgeCheck className="size-4 shrink-0 text-primary" />
                            Complete each step in order — your credit readiness
                            unlocks once your file is complete.
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
