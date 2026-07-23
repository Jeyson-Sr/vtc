<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('syrups', function (Blueprint $table) {
            $table->id();
            $table->string('sku')->nullable();
            $table->string('name');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('syrup_ingredients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('syrup_id')->constrained()->cascadeOnDelete();
            $table->string('cod_aje');
            $table->string('cod_emb');
            $table->string('description');
            $table->string('um');
            $table->decimal('factor', 12, 6);
            $table->boolean('is_active')->default(true);
            $table->foreignId('substitute_of_id')->nullable()->constrained('syrup_ingredients')->nullOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('sku');
            $table->string('name');
            $table->string('type')->default('envasado');
            $table->foreignId('syrup_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('units_per_package', 12, 6)->default(1);
            $table->decimal('syrup_factor', 12, 6)->default(0);
            $table->decimal('water_factor', 12, 6)->default(0);
            $table->decimal('yield_factor', 8, 6)->default(0.997);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('product_ingredients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('cod_aje');
            $table->string('cod_emb');
            $table->string('description');
            $table->string('um');
            $table->decimal('factor', 12, 6);
            $table->string('category')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('substitute_of_id')->nullable()->constrained('product_ingredients')->nullOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_ingredients');
        Schema::dropIfExists('products');
        Schema::dropIfExists('syrup_ingredients');
        Schema::dropIfExists('syrups');
    }
};
