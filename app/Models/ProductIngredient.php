<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductIngredient extends Model
{
    public const PACKAGING_CATEGORIES = [
        'preforma',
        'tapa',
        'etiqueta',
        'lamina',
        'stretch',
        'carton',
    ];

    protected $fillable = [
        'product_id',
        'cod_aje',
        'cod_emb',
        'description',
        'um',
        'factor',
        'category',
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

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function substituteOf(): BelongsTo
    {
        return $this->belongsTo(self::class, 'substitute_of_id');
    }

    public function substitutes(): HasMany
    {
        return $this->hasMany(self::class, 'substitute_of_id');
    }

    public function isPackagingMaterial(): bool
    {
        if ($this->category && in_array($this->category, self::PACKAGING_CATEGORIES, true)) {
            return true;
        }

        return str_starts_with($this->cod_emb, 'EMB-');
    }
}
