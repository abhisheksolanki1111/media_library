<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Media extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'path',
        'thumbnail_path',
        'mime_type',
        'user_id',
        'expiry_time',
    ];
    protected $dates = [
        'expiry_time',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isExpired()
    {
        return now()->gte($this->expiry_time);
    }

    public function isImage()
    {
        return strpos($this->mime_type, 'image/') === 0;
    }

    public function isVideo()
    {
        return strpos($this->mime_type, 'video/') === 0;
    }
}
