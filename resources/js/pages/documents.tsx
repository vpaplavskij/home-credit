import { Head, router } from '@inertiajs/react';
import { Pencil, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { destroy, edit, example, index } from '@/routes/documents';

type Document = {
    id: number;
    name: string;
    size: number;
    mime_type: string | null;
    created_at: string | null;
};

function formatBytes(bytes: number): string {
    if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
    if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${bytes} B`;
}

function formatDate(date: string | null): string {
    if (!date) return 'Not uploaded yet';
    return `Uploaded ${date}`;
}

export default function Documents({ documents }: { documents: Document[] }) {
    const verified = 0; // TODO: wire up verification status once review flow is built

    return (
        <>
            <Head title="Documents" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Bank cost-estimate hero */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <CardTitle>Your credit file</CardTitle>
                                <CardDescription className="mt-1">
                                    {verified} of {documents.length} required
                                    documents verified. Keep this list complete
                                    to speed up approval.
                                </CardDescription>
                            </div>
                            <Badge
                                variant="secondary"
                                className="hidden font-mono text-[11px] sm:inline-flex"
                            >
                                FILE #DF-0042
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-wrap items-center gap-3">
                        <Button
                            size="sm"
                            type="button"
                            onClick={() =>
                                router.post(
                                    example.url(),
                                    {},
                                    {
                                        preserveScroll: true,
                                        onSuccess: () =>
                                            router.visit(index.url()),
                                    },
                                )
                            }
                        >
                            <UploadCloud />
                            Add Swedbank cost estimate
                        </Button>
                        <Button size="sm" type="button" disabled>
                            <UploadCloud />
                            Add Seb cost estimate
                        </Button>
                        <Button size="sm" type="button" disabled>
                            <UploadCloud />
                            Add Luminor cost estimate
                        </Button>
                    </CardContent>
                </Card>

                {/* Document list */}
                <Card className="gap-0 py-5">
                    <CardHeader className="px-5">
                        <CardTitle className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                            Required documents
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 px-3 pt-2">
                        {documents.length === 0 && (
                            <p className="px-2 py-4 text-sm text-muted-foreground">
                                No documents uploaded yet.
                            </p>
                        )}
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center gap-4 rounded-md px-2 py-3 transition-colors hover:bg-muted/40"
                            >
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/40">
                                    <UploadCloud className="size-4 text-muted-foreground" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">
                                        {doc.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatBytes(doc.size)} ·{' '}
                                        {formatDate(doc.created_at)}
                                    </p>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className="hidden w-32 justify-center sm:inline-flex"
                                >
                                    Pending review
                                </Badge>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    type="button"
                                    onClick={() => router.get(edit.url(doc.id))}
                                >
                                    <Pencil className="size-3.5" />
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    type="button"
                                    onClick={() => {
                                        router.delete(destroy.url(doc.id), {
                                            preserveScroll: true,
                                            onSuccess: () => {
                                                toast.success(
                                                    'Document deleted.',
                                                );
                                                router.visit(index.url());
                                            },
                                        });
                                    }}
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                >
                                    Delete
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Documents.layout = {
    breadcrumbs: [
        {
            title: 'Documents',
            href: '/documents',
        },
    ],
};
