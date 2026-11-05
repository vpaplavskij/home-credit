<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
     * Store an uploaded document.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:pdf,png,jpg,jpeg,webp,doc,docx,xls,xlsx', 'max:10240'],
        ]);

        $path = $request->file('file')->store("documents/{$request->user()->id}", 'local');

        $document = $request->user()->documents()->create([
            'name' => $request->file('file')->getClientOriginalName(),
            'path' => $path,
            'size' => $request->file('file')->getSize(),
            'mime_type' => $request->file('file')->getMimeType(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Document uploaded.')]);

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
