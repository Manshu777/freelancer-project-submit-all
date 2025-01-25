<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRegestration extends Model
{
    use HasFactory;
    protected $fillable = [
        'image',
        'User_Name',
        'Full_Name',
        'Email',
        'Contact',
      
        'role',
        'gender',
        'password',
        'about',         
        'skills',      
        'projects',
        'education',      
        'token'
    ];

    // Cast JSON fields to arrays
    protected $casts = [
        'skills' => 'array',
        'projects' => 'array',
        'education' => 'array',
    ];
}
