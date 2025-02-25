<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class File extends Model
{
    protected $fillable = [
        'name',
        'original_name',
        'path',
        'size',
        'type',
        'disk',
        'password',
        'version',
        'uploaded_by',
        'fileable_type',
        'fileable_id'
    ];

    protected $hidden = [
        'password'
    ];

    protected $casts = [
        'size' => 'integer',
    ];

    protected $appends = ['url', 'is_password_protected'];

    public function getUrlAttribute()
    {
        if ($this->disk === 'public_access') {
            return asset('storage/public_access/' . $this->name);
        }
        return null;
    }

    public function getIsPasswordProtectedAttribute()
    {
        return !is_null($this->attributes['password']);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function versions()
    {
        return $this->hasMany(FileVersion::class)->orderBy('version', 'desc');
    }

    public function fileable()
    {
        return $this->morphTo();
    }

    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = $value ? Hash::make($value) : null;
    }

    public function checkPassword($password)
    {
        return Hash::check($password, $this->password);
    }
} 