<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Syrup extends Model
{
    protected $fillable = [
        'sku',
        'name',
        'notes',
    ];

    public function ingredients(): HasMany
    {
        return $this->hasMany(SyrupIngredient::class)->orderBy('sort_order');
    }

    public function activeIngredients(): HasMany
    {
        return $this->ingredients()->where('is_active', true);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
