import { Head, router, usePage } from '@inertiajs/react';
import { useRef } from 'react';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit, index, update } from '@/routes/documents';

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

export default function EditDocument({ document }: { document: Document }) {
    const formRef = useRef<HTMLFormElement>(null);
    const { errors } = usePage<{ errors?: Record<string, string> }>().props;

    const handleSubmit = () => {
        const form = formRef.current;
        if (!form) return;

        const data = new FormData(form);
        const name = String(data.get('name') ?? '');

        // Client-side mirror of the server rules; server is the source of truth.
        if (!name.trim()) {
            toast.error('Please give the document a name.');
            return;
        }

        router.put(update.url(document.id), data, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Document updated.');
                router.visit(index.url());
            },
        });
    };

    return (
        <>
            <Head title={`Edit ${document.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="gap-0 py-5">
                    <CardHeader className="px-5">
                        <CardTitle className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                            Editing document
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 pt-2">
                        <div className="flex items-center gap-4 rounded-md px-2 py-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/40">
                                <UploadCloud className="size-4 text-muted-foreground" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                    {document.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {formatBytes(document.size)} ·{' '}
                                    {formatDate(document.created_at)}
                                </p>
                            </div>
                            <Badge
                                variant="secondary"
                                className="hidden w-32 justify-center sm:inline-flex"
                            >
                                Pending review
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Edit document</CardTitle>
                        <CardDescription className="mt-1">
                            Rename the document.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            ref={formRef}
                            className="grid gap-5"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={document.name}
                                    required
                                    aria-invalid={!!errors?.name}
                                />
                                <InputError message={errors?.name} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Button type="submit">Save changes</Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => router.visit(index.url())}
                                >
                                    <ArrowLeft />
                                    Back to documents
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EditDocument.layout = ({ document }: { document: Document }) => ({
    breadcrumbs: [
        {
            title: 'Documents',
            href: index.url(),
        },
        {
            title: 'Edit document',
            href: edit.url(document.id),
        },
    ],
});
