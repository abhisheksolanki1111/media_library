<?php

namespace App\Http\Controllers;

use App\Models\Media;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class MediaController extends Controller
{

    public function index()
    {
        $media = Media::where('expiry_time', '>', now())
            ->with('user:id,name')
            ->get();

        return response()->json($media);
    }


    public function store(Request $request)
    {
        $user = auth()->user();
        if (!$user->isUploader()) {
            return response()->json(['error' => 'Unauthorized - Only uploaders and admins can upload media'], 403);
        }

        $file = $request->file('file');
        $mimeType = $file->getMimeType();
        $extension = $file->getClientOriginalExtension();
        $fileName = time() . '_' . uniqid() . '.' . $extension;
        $filePath = 'media/' . $fileName;

        Storage::disk('public')->put($filePath, file_get_contents($file));

        $thumbnailPath = null;

        if (strpos($mimeType, 'image/') === 0) {
            $thumbnailName = 'thumb_' . $fileName;
            $thumbnailPath = 'thumbnails/' . $thumbnailName;
            $thumbFullPath = Storage::disk('public')->path($thumbnailPath);

            $thumbDirectory = dirname($thumbFullPath);
            if (!file_exists($thumbDirectory)) {
                mkdir($thumbDirectory, 0755, true);
            }

            $sourcePath = $file->getPathname();
            $image = null;

            switch ($mimeType) {
                case 'image/jpeg':
                    $image = imagecreatefromjpeg($sourcePath);
                    break;
                case 'image/png':
                    $image = imagecreatefrompng($sourcePath);
                    break;
                case 'image/gif':
                    $image = imagecreatefromgif($sourcePath);
                    break;
                default:
                    $image = null;
                    break;
            }

            if ($image) {
                $width = imagesx($image);
                $height = imagesy($image);
                $newWidth = 300;
                $newHeight = intval($height * ($newWidth / $width));

                $thumb = imagecreatetruecolor($newWidth, $newHeight);
                imagecopyresampled($thumb, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

                if ($mimeType === 'image/png') {
                    imagepng($thumb, $thumbFullPath);
                } elseif ($mimeType === 'image/gif') {
                    imagegif($thumb, $thumbFullPath);
                } else {
                    imagejpeg($thumb, $thumbFullPath, 90);
                }

                imagedestroy($image);
                imagedestroy($thumb);
            }
        }

        $media = Media::create([
            'title' => $request->title,
            'path' => $filePath,
            'thumbnail_path' => $thumbnailPath,
            'mime_type' => $mimeType,
            'user_id' => $user->id,
            'expiry_time' => Carbon::parse($request->expiryTime),
        ]);

        return response()->json([
            'media' => $media,
            'file_url' => Storage::disk('public')->url($media->path),
            'thumbnail_url' => $media->thumbnail_path ? Storage::disk('public')->url($media->thumbnail_path) : null,
        ], 201);
    }

    public function show($id)
    {
        $media = Media::findOrFail($id);

        if ($media->isExpired()) {
            return response()->json(['error' => 'Media has expired'], 410);
        }

        if (strpos($media->mime_type, 'image/') !== 0) {
            return response()->json(['error' => 'Not an image file'], 400);
        }

        $filePath = Storage::disk('public')->path($media->path);
        if (!file_exists($filePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        return response()->json([
            'file_url' => Storage::disk('public')->url($media->path),
            'thumbnail_url' => $media->thumbnail_path ? Storage::disk('public')->url($media->thumbnail_path) : null,
        ]);
    }


    public function destroy($id)
    {
        $user = auth()->user();
        if (!$user->isAdmin()) {
            return response()->json(['error' => 'Unauthorized - Only admins can delete media'], 403);
        }

        $media = Media::findOrFail($id);

        Storage::disk('public')->delete($media->path);
        if ($media->path) {
            Storage::disk('public')->delete($media->path);
        }

        $media->delete();

        return response()->json(['message' => 'Media deleted successfully']);
    }


    public function expired()
    {
        // $user =auth->user();
        // dd($user);
        // if (!$user->isAdmin()) {
        //     return response()->json(['error' => 'Unauthorized - Only admins can view expired media'], 403);
        // }

        $expiredMedia = Media::with('user:id,name')->where('expiry_time', '<=', now())->get();
        return response()->json($expiredMedia);
    }
    
}
