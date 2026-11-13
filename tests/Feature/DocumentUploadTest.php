<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentUploadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('local');

        $this->actingAs(User::factory()->create());
    }

    public function test_user_can_add_example_swedbank_estimate()
    {
        $response = $this->post('/documents/example');

        $response->assertRedirect('/documents');
        $this->assertDatabaseHas('documents', [
            'name' => 'Swedbank cost estimate',
            'user_id' => auth()->id(),
            'path' => 'documents/'.auth()->id().'/swedbank-cost-estimate.xlsx',
            'mime_type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);

        Storage::disk('local')->assertExists('documents/'.auth()->id().'/swedbank-cost-estimate.xlsx');
    }

    public function test_example_swedbank_estimate_is_not_added_twice()
    {
        $this->post('/documents/example');
        $response = $this->post('/documents/example');

        $response->assertInertiaFlash('toast', [
            'type' => 'error',
            'message' => 'Already in your credit file.',
        ]);

        $this->assertSame(1, Document::where('name', 'Swedbank cost estimate')->count());
    }

    public function test_user_can_delete_document()
    {
        $document = Document::factory()->create([
            'user_id' => auth()->id(),
            'path' => 'documents/'.auth()->id().'/test.txt',
        ]);

        Storage::disk('local')->put($document->path, 'test content');

        $response = $this->delete("/documents/{$document->id}");

        $response->assertRedirect('/documents');
        $this->assertDatabaseMissing('documents', ['id' => $document->id]);
        Storage::disk('local')->assertMissing($document->path);
    }

    public function test_user_can_rename_document()
    {
        $document = Document::factory()->create([
            'user_id' => auth()->id(),
            'path' => 'documents/'.auth()->id().'/test.pdf',
        ]);

        $response = $this->put("/documents/{$document->id}", [
            'name' => 'Renamed document',
        ]);

        $response->assertRedirect('/documents');
        $this->assertDatabaseHas('documents', [
            'id' => $document->id,
            'name' => 'Renamed document',
        ]);
    }

    public function test_user_cannot_update_others_document()
    {
        $other = User::factory()->create();
        $document = Document::factory()->create(['user_id' => $other->id]);

        $response = $this->put("/documents/{$document->id}", [
            'name' => 'Hacked',
        ]);

        $response->assertNotFound();
    }

    public function test_update_requires_name()
    {
        $document = Document::factory()->create([
            'user_id' => auth()->id(),
            'path' => 'documents/'.auth()->id().'/test.pdf',
        ]);

        $response = $this->put("/documents/{$document->id}", [
            'name' => '',
        ]);

        $response->assertInvalid(['name']);
    }
}
