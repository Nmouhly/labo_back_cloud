<?php

namespace App\Http\Middleware;
use Illuminate\Support\Facades\Auth;
use Closure;

class CheckMemberStatus
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
        $user = Auth::user();

        // Vérifier si l'utilisateur a un membre associé et que ce membre est actif
        if ($user && $user->member && $user->member->status !== 'actif') {
            // Déconnecter l'utilisateur ou rediriger avec un message d'erreur
            Auth::logout();
            return redirect('/login')->with('error', 'Votre compte est inactif.');
        }

        return $next($request);
    }
}
