<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Events\PusherBoardcast;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\ChatMessages;

class PusherController extends Controller
{
    public function index()
    {
        $users = User::where('id', '!=', Auth::id())
                    ->select('id', 'name', 'email')
                    ->get();

        $messages = ChatMessages::where('sender_id', Auth::id())
                    ->orWhere('recipient_id', Auth::id())
                    ->with(['sender:id,name,email', 'recipient:id,name,email'])
                    ->orderBy('created_at', 'asc')
                    ->get();

        return Inertia::render('ChatApplication/Index', [
            'user' => Auth::user(),
            'users' => $users,
            'messages' => $messages
        ]);
    }

    public function broadcast(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'recipient_id' => 'required|exists:users,id'
        ]);

        $message = ChatMessages::create([
            'sender_id' => Auth::id(),
            'recipient_id' => $request->recipient_id,
            'message' => $request->message
        ]);

        $message->load(['sender:id,name,email', 'recipient:id,name,email']);
        
        try {
            \Log::info('Broadcasting message:', [
                'message' => $message->toArray(),
                'channel' => 'servudemo',
                'event' => 'message.sent'
            ]);
            
            $event = new PusherBoardcast($message);
            broadcast($event);
            
            \Log::info('Broadcast successful');
        } catch (\Exception $e) {
            \Log::error('Broadcast failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
        
        return response()->json(['message' => $message]);
    }

    public function receive(Request $request)
    {
        $message->load(['sender:id,name,email', 'recipient:id,name,email']);

        return response()->json(['message' => $message]);
    }
}
