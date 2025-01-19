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
        'about',         // Freelancer about/description
        'skills',        // JSON field for skills
        'projects',      // JSON field for projects
        'education',      // JSON field for education
        'token'
    ];

    // Cast JSON fields to arrays
    protected $casts = [
        'skills' => 'array',
        'projects' => 'array',
        'education' => 'array',
    ];
}
