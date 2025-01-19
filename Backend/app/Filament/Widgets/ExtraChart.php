<?php

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;

class ExtraChart extends ChartWidget
{
    protected static ?string $heading = 'Chart';

    protected function getData(): array
    {
        $labels = [
            '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
            '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'
        ];
    
        // Dummy data for each month
        $data = [
            120, // January
            95,  // February
            140, // March
            110, // April
            130, // May
            105, // June
            150, // July
            125, // August
            115, // September
            160, // October
            140, // November
            135  // December
        ];
    
        return [
            'datasets' => [
                [
                    'label' => 'Blog posts',
                    'data' => $data,
                ],
            ],
            'labels' => $labels,
        ];$labels = [
        '2024-01', '2024-02', '2024-03', '2024-04', '2024-05', '2024-06',
        '2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12'
    ];

    }

    protected function getType(): string
    {
        return 'line';
    }
}
