<?php

namespace App\Http\Middleware;
use Illuminate\Support\Facades\Auth;
use Closure;

class ApiUserMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (Auth::check()) {
            if (auth()->user()->role === 0) { // Vérifie si l'utilisateur est un utilisateur régulier
                return $next($request);
            } else {
                return response()->json([
                    'message' => 'Accès refusé ! Vous n\'êtes pas un utilisateur autorisé.',
                ], 403);
            }
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Veuillez vous connecter d\'abord.',
            ]);
        }
    }
}
