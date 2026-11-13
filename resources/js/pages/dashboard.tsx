import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BadgeCheck,
    CheckCircle2,
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

type DashboardProps = {
    userName: string;
    hasProperty: boolean;
    documentsCount: number;
};

const MIN_DOCUMENTS_FOR_REVIEW = 3;

export default function Dashboard({
    userName,
    hasProperty,
    documentsCount,
}: DashboardProps) {
    const hasDocuments = documentsCount > 0;
    const fileComplete =
        hasProperty && documentsCount >= MIN_DOCUMENTS_FOR_REVIEW;

    const highlights = [
        {
            label: 'Credit readiness',
            value: fileComplete ? 'Ready' : '—',
            hint: fileComplete
                ? 'Your file is complete and ready for bank review.'
                : 'Calculated once your home profile and documents are on file.',
            icon: ShieldCheck,
        },
        {
            label: 'Documents on file',
            value: String(documentsCount),
            hint: hasDocuments
                ? 'Stored securely in one place.'
                : 'Upload deeds, valuations and income proof here.',
            icon: FileText,
        },
        {
            label: 'Next step',
            value: !hasProperty
                ? 'Add your home'
                : !hasDocuments
                  ? 'Upload documents'
                  : documentsCount < MIN_DOCUMENTS_FOR_REVIEW
                    ? `Add ${MIN_DOCUMENTS_FOR_REVIEW - documentsCount} more document${documentsCount === MIN_DOCUMENTS_FOR_REVIEW - 1 ? '' : 's'}`
                    : 'Review file',
            hint: !hasProperty
                ? 'Start by telling us about the property you own.'
                : !hasDocuments
                  ? 'Add deeds, valuations and income proof to your file.'
                  : documentsCount < MIN_DOCUMENTS_FOR_REVIEW
                    ? `Aim for at least ${MIN_DOCUMENTS_FOR_REVIEW} documents so banks have what they need.`
                    : 'Your file is ready — share it with your bank.',
            icon: Home,
        },
    ];

    const steps = [
        {
            stage: 'Step 1',
            title: 'Add your home',
            description:
                'Tell us about the property you own so we can assess it.',
            href: myHome(),
            icon: Home,
            done: hasProperty,
        },
        {
            stage: 'Step 2',
            title: 'Upload documents',
            description: 'Add deeds, valuations and income proof to your file.',
            href: documents(),
            icon: Upload,
            done: hasDocuments,
        },
        {
            stage: 'Step 3',
            title: `Keep ${MIN_DOCUMENTS_FOR_REVIEW}+ on file`,
            description: `Banks want at least ${MIN_DOCUMENTS_FOR_REVIEW} documents to see the full picture.`,
            href: documents(),
            icon: FileText,
            done: documentsCount >= MIN_DOCUMENTS_FOR_REVIEW,
        },
        {
            stage: 'Outcome',
            title: 'Credit approval',
            description:
                'Your file is complete and ready to share with your bank.',
            actionLabel: 'Review your file',
            icon: Landmark,
            done: fileComplete,
        },
    ];

    const completedSteps = steps.filter((step) => step.done).length;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Welcome */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <CardTitle>Welcome back, {userName}</CardTitle>
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
                                {completedSteps}/{steps.length} complete
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-3">
                        {!hasProperty && (
                            <Button asChild size="sm">
                                <Link href={myHome()} prefetch>
                                    Add my home
                                </Link>
                            </Button>
                        )}
                        <Button
                            asChild
                            size="sm"
                            variant={hasProperty ? 'default' : 'outline'}
                        >
                            <Link href={documents()} prefetch>
                                Documents
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
                        </div>

                        <ol className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
                            {steps.map((step, index) => (
                                <li
                                    key={step.title}
                                    className="flex min-w-0 flex-1 items-center gap-2 lg:flex-col lg:gap-4 lg:p-1"
                                >
                                    <div
                                        className={`flex min-w-0 flex-1 items-center gap-3 rounded-lg border bg-card p-3 transition-colors lg:flex-col lg:items-center lg:text-center ${
                                            step.done
                                                ? 'border-success/50'
                                                : 'border-border/70 hover:border-primary/40'
                                        }`}
                                    >
                                        <div
                                            className={`relative flex size-11 shrink-0 items-center justify-center rounded-full border shadow-xs ${
                                                step.done
                                                    ? 'border-success/50 bg-success/10 text-success'
                                                    : 'border-border bg-card text-primary'
                                            }`}
                                        >
                                            {step.done ? (
                                                <CheckCircle2 className="size-5" />
                                            ) : (
                                                <step.icon className="size-5" />
                                            )}
                                            <span
                                                className={`absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full font-mono text-[11px] font-semibold ${
                                                    step.done
                                                        ? 'bg-success text-white'
                                                        : 'bg-muted text-muted-foreground'
                                                }`}
                                                aria-hidden
                                            >
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                                                {step.stage}
                                            </p>
                                            {step.actionLabel ? (
                                                <Button
                                                    asChild
                                                    size="sm"
                                                    variant={
                                                        step.done
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    className="mt-2 w-full"
                                                >
                                                    <Link
                                                        href={dashboard()}
                                                        prefetch
                                                    >
                                                        {step.actionLabel}
                                                    </Link>
                                                </Button>
                                            ) : (
                                                <>
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
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <span
                                            className={`flex size-6 shrink-0 items-center justify-center ${
                                                step.done
                                                    ? 'text-success/70'
                                                    : 'text-muted-foreground/70'
                                            }`}
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
                            Work through the steps in order — your credit
                            readiness unlocks once your file is complete.
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
