<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    /**
     * Show the my-home page with the user's property.
     */
    public function index(Request $request): Response
    {
        $property = $request->user()->property()->first();

        return Inertia::render('my-home', [
            'property' => $property ? [
                'id' => $property->id,
                'name' => $property->name,
                'address' => $property->address,
                'size_sqm' => $property->size_sqm,
                'beds' => $property->beds,
                'baths' => $property->baths,
                'purchased_at' => $property->purchased_at?->format('F Y'),
                'owners' => $property->owners,
            ] : null,
        ]);
    }

    /**
     * Update the user's property details.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'size_sqm' => ['nullable', 'integer', 'min:1', 'max:100000'],
            'beds' => ['nullable', 'integer', 'min:0', 'max:32'],
            'baths' => ['nullable', 'integer', 'min:0', 'max:32'],
            'purchased_at' => ['nullable', 'date'],
            'owners' => ['nullable', 'string', 'max:255'],
        ]);

        $property = $request->user()->property()->updateOrCreate([], $validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Property updated.')]);

        return to_route('my-home');
    }
}
