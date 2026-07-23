<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    public const TYPE_ENVASADO = 'envasado';

    public const TYPE_AUXILIAR = 'auxiliar';

    protected $fillable = [
        'sku',
        'name',
        'type',
        'syrup_id',
        'units_per_package',
        'syrup_factor',
        'water_factor',
        'yield_factor',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'units_per_package' => 'decimal:6',
            'syrup_factor' => 'decimal:6',
            'water_factor' => 'decimal:6',
            'yield_factor' => 'decimal:6',
        ];
    }

    public function syrup(): BelongsTo
    {
        return $this->belongsTo(Syrup::class);
    }

    public function ingredients(): HasMany
    {
        return $this->hasMany(ProductIngredient::class)->orderBy('sort_order');
    }

    public function activeIngredients(): HasMany
    {
        return $this->ingredients()->where('is_active', true);
    }

    public function scopeEnvasado($query)
    {
        return $query->where('type', self::TYPE_ENVASADO);
    }

    public function scopeAuxiliar($query)
    {
        return $query->where('type', self::TYPE_AUXILIAR);
    }
}
