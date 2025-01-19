<?php

namespace App\Filament\Widgets;

use App\Models\UserRegestration;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestOrders extends BaseWidget
{
    protected int | string | array $columnSpan = 'full';
    public function table(Table $table): Table
    {
        return $table
            ->query(UserRegestration::query()) // Fetch data from UserRegistration model
            ->columns([
                Tables\Columns\ImageColumn::make('image')->label('Profile Image'),
                Tables\Columns\TextColumn::make('User_Name')->label('User Name'),
                Tables\Columns\TextColumn::make('Full_Name')->label('Full Name'),
                Tables\Columns\TextColumn::make('Email')->label('Email'),
                Tables\Columns\TextColumn::make('Contact')->label('Contact'),
                Tables\Columns\TextColumn::make('Dob')->label('Date of Birth')->date(),
                Tables\Columns\TextColumn::make('role')->label('Role'),
                Tables\Columns\TextColumn::make('gender')->label('Gender'),
                Tables\Columns\TextColumn::make('skills')->label('Skills')
                    ->formatStateUsing(fn ($state) => implode(', ', json_decode($state, true) ?? [])),
                Tables\Columns\TextColumn::make('projects')->label('Projects')
                    ->formatStateUsing(fn ($state) => implode(', ', json_decode($state, true) ?? [])),
                Tables\Columns\TextColumn::make('education')->label('Education')
                    ->formatStateUsing(fn ($state) => implode(', ', json_decode($state, true) ?? [])),
            ]);
    }
}
