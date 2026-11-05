import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type Property = {
    id: number;
    name: string;
    address: string;
    size_sqm: number | null;
    beds: number | null;
    baths: number | null;
    purchased_at: string | null;
    owners: string | null;
};

const checklist = [
    { label: 'Ownership verified', done: true },
    { label: 'Mortgage status confirmed', done: true },
    { label: 'Valuation on file', done: true },
    { label: 'Utility bills (3 months)', done: false },
];

export default function MyHome({ property }: { property: Property | null }) {
    const [open, setOpen] = useState(false);

    const details = [
        { icon: MapPin, label: 'Address', value: property?.address ?? '—' },
        {
            icon: Ruler,
            label: 'Size',
            value: property
                ? `${property.size_sqm ?? '—'} m² · ${property.beds ?? '—'} beds · ${property.baths ?? '—'} baths`
                : '—',
        },
        { icon: CalendarDays, label: 'Purchased', value: property?.purchased_at ?? '—' },
        { icon: Users, label: 'Owners', value: property?.owners ?? '—' },
    ];

    const submit = (data: Record<string, string>) => {
        router.put('/my-home', {
            ...data,
            size_sqm: data.size_sqm ? Number(data.size_sqm) : null,
            beds: data.beds ? Number(data.beds) : null,
            baths: data.baths ? Number(data.baths) : null,
        });
    };

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
                                    <CardTitle>{property?.name ?? 'No property yet'}</CardTitle>
                                    <CardDescription className="mt-0.5 flex items-center gap-1">
                                        <MapPin className="size-3.5" />
                                        {property?.address ?? 'Add your property details'}
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
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                    <Building2 />
                                    Edit property
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit property</DialogTitle>
                                    <DialogDescription>
                                        Update the details of your home.
                                    </DialogDescription>
                                </DialogHeader>
                                <Form
                                    method="post"
                                    action="#"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const form = new FormData(e.currentTarget);
                                        submit(Object.fromEntries(form.entries()));
                                    }}
                                    className="grid gap-4"
                                >
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Property name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={property?.name ?? ''}
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            name="address"
                                            defaultValue={property?.address ?? ''}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="size_sqm">Size (m²)</Label>
                                            <Input
                                                id="size_sqm"
                                                name="size_sqm"
                                                type="number"
                                                min={1}
                                                defaultValue={property?.size_sqm ?? ''}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="beds">Beds</Label>
                                            <Input
                                                id="beds"
                                                name="beds"
                                                type="number"
                                                min={0}
                                                defaultValue={property?.beds ?? ''}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="baths">Baths</Label>
                                            <Input
                                                id="baths"
                                                name="baths"
                                                type="number"
                                                min={0}
                                                defaultValue={property?.baths ?? ''}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="purchased_at">Purchased</Label>
                                        <Input
                                            id="purchased_at"
                                            name="purchased_at"
                                            type="date"
                                            defaultValue={
                                                property?.purchased_at
                                                    ? new Date(
                                                        property.purchased_at,
                                                    ).toISOString().slice(0, 10)
                                                    : ''
                                            }
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="owners">Owners</Label>
                                        <Input
                                            id="owners"
                                            name="owners"
                                            defaultValue={property?.owners ?? ''}
                                        />
                                    </div>
                                    <DialogFooter className="mt-2">
                                        <Button type="submit">Save changes</Button>
                                    </DialogFooter>
                                </Form>
                            </DialogContent>
                        </Dialog>
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
