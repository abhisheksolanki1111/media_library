<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserRole
{ 
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = Auth::user(); 
        if (!$user || !in_array($user->role, $roles)) {
            return response()->json(['error' => 'Unauthorized - Insufficient permissions'], 403);
        }

        return $next($request);
    }
}
