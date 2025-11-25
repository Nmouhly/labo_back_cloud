<?php

namespace App\Http\Middleware;

use Illuminate\Support\Facades\Auth;

use Closure;

class ApiAdminMiddleware
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
            if (auth()->user()->tokenCan('server:admin')) {
                return $next($request);

            } else {
                return response()->json([
                    'message' => 'Access Denied.!As you are not an admin.',
                ], 403);
            }


        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Please login firs',
            ]);
        }
    }
}
