<?php

namespace App\Http\Controllers;

use App\Models\UserRegestration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UserRegestrationController extends Controller
{
    /**
     * Display a listing of all user registrations.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Return all user registrations
        return response()->json(UserRegestration::all());
    }

    /**
     * Store a newly created user registration.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate incoming request
        $request->validate([
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'User_Name' => 'required|unique:user_regestrations',
            'Full_Name' => 'required',
            'Email' => 'required|email|unique:user_regestrations',
            'Contact' => 'nullable|string',
            'Dob' => 'nullable',
            'role' => 'nullable|string',
            'gender' => 'nullable|string',
            'password' => 'required|string|min:8',
            'about' => 'nullable|string',
            'skills' => 'nullable|array',
            'projects' => 'nullable|array',
            'education' => 'nullable|array',
        ]);

        // Handle image upload if available
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('User_pictures', 'public');
        }

        // Generate a random token
        $token = Str::random(128);

        try {
            // Create a new user registration record in the database
            $userRegestration = UserRegestration::create([
                'image' => $imagePath,
                'User_Name' => $request->User_Name,
                'Full_Name' => $request->Full_Name,
                'Email' => $request->Email,
                'Contact' => $request->Contact,
                'Date-Of-Birth' => $request->Dob, // Use Date-Of-Birth field
                'role' => $request->role,
                'gender' => $request->gender,
                'password' => bcrypt($request->password), // Hash the password
                'about' => $request->about,
                'skills' => $request->skills,
                'projects' => $request->projects,
                'education' => $request->education,
                'token' => $token, // Save the token in the database
            ]);

            // Return the created user and token
            return response()->json([
                'user_regestration' => $userRegestration,
                'token' => $token,
            ], 201);
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('User registration failed: ' . $e->getMessage());

            return response()->json([
                'message' => 'An error occurred during registration. Please try again later.',
            ], 500);
        }
    }

    /**
     * Update an existing user registration.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            // Find the user registration record by ID
            $userRegestration = UserRegestration::findOrFail($id);

            // Validate incoming request
            $request->validate([
                'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
                'User_Name' => 'string|unique:user_regestrations,User_Name,' . $id,
                'Full_Name' => 'nullable|string',
                'Email' => 'nullable|email|unique:user_regestrations,Email,' . $id,
                'Contact' => 'nullable|string|unique:user_regestrations,Contact,' . $id,
                'Dob' => 'nullable|date',
                'role' => 'nullable|string',
                'gender' => 'nullable|string',
                // 'password' => 'string|min:8',
                'about' => 'nullable|string',
                'skills' => 'nullable|array',
                'projects' => 'nullable|array',
                'education' => 'nullable|array',
                'token' => 'nullable|string',
            ]);

            if ($request->hasFile('image')) {
                if ($userRegestration->image) {
                    Storage::disk('public')->delete($userRegestration->image);
                }
                $userRegestration->image = $request->file('image')->store('User_pictures', 'public');
            }

            $userRegestration->update([
                'User_Name' => $request->User_Name ?? $userRegestration->User_Name,
                'Full_Name' => $request->Full_Name ?? $userRegestration->Full_Name,
                'Email' => $request->Email ?? $userRegestration->Email,
                'Contact' => $request->Contact ?? $userRegestration->Contact,
                'Dob' => $request->Dob ?? $userRegestration->Dob,
                'role' => $request->role ?? $userRegestration->role,
                'gender' => $request->gender ?? $userRegestration->gender,
                // 'password' => $request->password ? bcrypt($request->password) : $userRegestration->password,
                'about' => $request->about ?? $userRegestration->about,
                'skills' => $request->skills ?? $userRegestration->skills,
                'projects' => $request->projects ?? $userRegestration->projects,
                'education' => $request->education ?? $userRegestration->education,
                'token' => $request->token ?? $userRegestration->token, // Update the token if provided
            ]);

            return response()->json([
                'message' => 'User updated successfully',
                'user_regestration' => $userRegestration,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified user registration from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // Find the user registration record by ID
        $userRegestration = UserRegestration::findOrFail($id);

        // Delete image if it exists
        if ($userRegestration->image) {
            Storage::disk('public')->delete($userRegestration->image);
        }

        // Delete the user registration record
        $userRegestration->delete();

        // Return a success message
        return response()->json(['message' => 'User deleted successfully']);
    }
}
