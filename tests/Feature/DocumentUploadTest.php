<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentUploadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('local');

        $this->actingAs(
            User::factory()
                ->withPersonalTeam()
                ->create()
        );
    }

    /** @test */
    public function user_can_upload_document()
    {
        $file = UploadedFile::fake()->image('test.jpg')->size(1024);

        $response = $this->post('/documents', [
            'file' => $file,
        ]);

        $response->assertRedirect('/documents');
        $this->assertDatabaseHas('documents', [
            'name' => 'test.jpg',
            'user_id' => auth()->id(),
        ]);

        Storage::disk('local')->assertExists("documents/{$this->user()->id}/test.jpg");
    }

    /** @test */
    public function user_can_delete_document()
    {
        $document = Document::factory()->create([
            'user_id' => auth()->id(),
            'path' => "documents/{$this->user()->id}/test.txt",
        ]);

        Storage::disk('local')->put($document->path, 'test content');

        $response = $this->delete("/documents/{$document->id}");

        $response->assertRedirect('/documents');
        $this->assertDatabaseMissing('documents', ['id' => $document->id]);
        Storage::disk('local')->assertMissing($document->path);
    }

    /** @test */
    public function document_upload_validates_file_type()
    {
        $file = UploadedFile::fake()->create('test.txt', 1024, 'text/plain');

        $response = $this->post('/documents', [
            'file' => $file,
        ]);

        $response->assertInvalid(['file']);
    }

    /** @test */
    public function document_upload_validates_file_size()
    {
        $file = UploadedFile::fake()->image('large.jpg')->size(10241); // 10MB + 1 byte

        $response = $this->post('/documents', [
            'file' => $file,
        ]);

        $response->assertInvalid(['file']);
    }
}
