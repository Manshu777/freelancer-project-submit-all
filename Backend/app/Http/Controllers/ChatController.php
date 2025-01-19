<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\ChatMessage;
use App\Models\Message;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;

class ChatController extends Controller
{
    /**
     * Send a chat message and broadcast it.
     */
    public function sendMessage(Request $request)
    {
        try {
            // Validate the incoming message request
            $request->validate([
                'message' => 'required|string|max:255',
                'user_id' => 'required|integer',
                'user_id2' => 'required|integer',
            ]);

            // Extract message and user_ids from the request
            $message = $request->message;
            $userId = $request->user_id;
            $userId2 = $request->user_id2;

            // Broadcast the message to the specific user channel
            broadcast(new ChatMessage($message, $userId));

            // Save the message in the database
            Message::create([
                'message' => $message,
                'user_1_id' => $userId,
                'user_2_id' => $userId2
            ]);

            // Return a success response
            return response()->json(['status' => 'Message Sent'], 200);

        } catch (ValidationException $e) {
            // Handle validation exceptions
            return response()->json(['error' => 'Validation Failed', 'message' => $e->errors()], 422);

        } catch (QueryException $e) {
            // Handle database errors
            return response()->json(['error' => 'Database Error', 'message' => $e->getMessage()], 500);

        } catch (\Exception $e) {
            // Catch any other exceptions
            return response()->json(['error' => 'Server Error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get the chat messages for a specific user.
     */
    public function getMessages($userId)
    {
        try {
            // Retrieve chat messages for the given user
            $messages = Message::where(function ($query) use ($userId) {
                $query->where('user_1_id', $userId)
                      ->orWhere('user_2_id', $userId);
            })
            ->orderBy('created_at', 'desc') // Order messages by the latest
            ->get();

            // If no messages are found
            if ($messages->isEmpty()) {
                return response()->json(['message' => 'No messages found'], 404);
            }

            // Format messages to include message content, user_id, and timestamp
            $formattedMessages = $messages->map(function ($message) {
                return [
                    'message' => $message->message,
                    'user_id' => $message->user_1_id == $message->user_1_id ? $message->user_1_id : $message->user_2_id,
                    'timestamp' => $message->created_at->toDateTimeString(),
                ];
            });

            // Return messages as JSON response
            return response()->json($formattedMessages, 200);

        } catch (QueryException $e) {
            // Handle database errors
            return response()->json(['error' => 'Database Error', 'message' => $e->getMessage()], 500);

        } catch (\Exception $e) {
            // Catch any other exceptions
            return response()->json(['error' => 'Server Error', 'message' => $e->getMessage()], 500);
        }
    }
}
