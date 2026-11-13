<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    /**
     * Show the documents page.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('documents', [
            'documents' => $request->user()
                ->documents()
                ->latest()
                ->get()
                ->map(fn (Document $document) => [
                    'id' => $document->id,
                    'name' => $document->name,
                    'size' => $document->size,
                    'mime_type' => $document->mime_type,
                    'created_at' => $document->created_at?->toDateString(),
                ]),
        ]);
    }

    /**
     * Add an example bank cost estimate document.
     */
    public function storeExample(Request $request): RedirectResponse
    {
        $user = $request->user();
        $name = 'Swedbank cost estimate';

        if ($user->documents()->where('name', $name)->exists()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('Already in your credit file.')]);

            return to_route('documents.index');
        }

        $content = file_get_contents(storage_path('buildng-tame-example-en.xlsx'));

        if ($content === false) {
            abort(500);
        }

        $path = "documents/{$user->id}/swedbank-cost-estimate.xlsx";

        // Row first, file second: if the write fails, the transaction rolls
        // the row back, so a crash can't leave an orphan file behind.
        DB::transaction(function () use ($user, $name, $path, $content) {
            $user->documents()->create([
                'name' => $name,
                'path' => $path,
                'size' => strlen($content),
                'mime_type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ]);

            Storage::disk('local')->put($path, $content);
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Example document added.')]);

        return to_route('documents.index');
    }

    /**
     * Show the document editing page.
     */
    public function edit(Request $request, int $documentId): Response
    {
        $document = $request->user()->documents()->findOrFail($documentId);

        return Inertia::render('documents/edit', [
            'document' => [
                'id' => $document->id,
                'name' => $document->name,
                'size' => $document->size,
                'mime_type' => $document->mime_type,
                'created_at' => $document->created_at?->toDateString(),
            ],
        ]);
    }

    /**
     * Rename a document.
     */
    public function update(Request $request, int $documentId): RedirectResponse
    {
        $document = $request->user()->documents()->findOrFail($documentId);

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $document->name = $request->input('name');
        $document->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Document updated.')]);

        return to_route('documents.index');
    }

    /**
     * Delete a document.
     */
    public function destroy(Request $request, int $documentId): RedirectResponse
    {
        $document = $request->user()->documents()->findOrFail($documentId);

        Storage::disk('local')->delete($document->path);

        $document->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Document deleted.')]);

        return to_route('documents.index');
    }
}
