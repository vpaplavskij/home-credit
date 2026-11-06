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
                'purchased_at' => $property->purchased_at?->format('Y-m-d'),
                'owners' => $property->owners,
            ] : null,
        ]);
    }

    /**
     * Update the user's property details.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate(
            [
                'name' => ['required', 'string', 'max:255'],
                'address' => ['required', 'string', 'max:255'],
                'size_sqm' => ['nullable', 'integer', 'min:10', 'max:100000'],
                'beds' => ['nullable', 'integer', 'min:0', 'max:32'],
                'baths' => ['nullable', 'integer', 'min:0', 'max:32'],
                'purchased_at' => ['nullable', 'date', 'before_or_equal:today'],
                'owners' => ['nullable', 'string', 'max:255'],
            ],
            [
                'name.required' => 'Please give your property a name.',
                'address.required' => 'The property address is required.',
                'size_sqm.min' => 'Size must be at least 10 m².',
                'size_sqm.max' => 'Size can’t exceed 100,000 m².',
                'beds.max' => 'Beds can’t exceed 32.',
                'baths.max' => 'Baths can’t exceed 32.',
                'purchased_at.before_or_equal' => 'Purchase date can’t be in the future.',
            ],
        );

        $property = $request->user()->property()->updateOrCreate([], $validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Property updated.')]);

        return to_route('my-home');
    }
}
