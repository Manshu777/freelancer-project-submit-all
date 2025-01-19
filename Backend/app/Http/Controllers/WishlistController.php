<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $wishlists = Wishlist::where('user_id')->get();
        return response()->json($wishlists, 200);
    }

    // Create a new wishlist
    public function store(Request $request)
    {
        $request->validate([
            'target_user_id' => 'required|exists:users,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $wishlist = Wishlist::create([
            'user_id' => $request->user_id,
            'target_user_id' => $request->target_user_id,
        ]);

        return response()->json($wishlist, 201);
    }

    // Show a specific wishlist entry
    public function show($id)
    {
        $wishlist = Wishlist::where('user_id')->findOrFail($id);
        return response()->json($wishlist, 200);
    }

    // Update a wishlist entry
    public function update(Request $request, $id)
    {
        $wishlist = Wishlist::where('user_id')->findOrFail($id);

        $request->validate([
            'target_user_id' => 'required|exists:users,id',
        ]);

        $wishlist->update([
            'target_user_id' => $request->target_user_id,
        ]);

        return response()->json($wishlist, 200);
    }

    // Delete a wishlist entry
    public function destroy($id)
    {
        $wishlist = Wishlist::where('user_id')->findOrFail($id);
        $wishlist->delete();

        return response()->json(['message' => 'Wishlist deleted successfully'], 200);
    }
}
