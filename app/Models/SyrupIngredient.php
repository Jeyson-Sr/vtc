<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SyrupIngredient extends Model
{
    protected $fillable = [
        'syrup_id',
        'cod_aje',
        'cod_emb',
        'description',
        'um',
        'factor',
        'is_active',
        'substitute_of_id',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'factor' => 'decimal:6',
            'is_active' => 'boolean',
        ];
    }

    public function syrup(): BelongsTo
    {
        return $this->belongsTo(Syrup::class);
    }

    public function substituteOf(): BelongsTo
    {
        return $this->belongsTo(self::class, 'substitute_of_id');
    }

    public function substitutes(): HasMany
    {
        return $this->hasMany(self::class, 'substitute_of_id');
    }
}
