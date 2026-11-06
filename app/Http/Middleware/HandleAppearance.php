<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class HandleAppearance
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        View::share('appearance', $request->cookie('appearance') ?? 'system');
        View::share(
            'palette',
            in_array($request->cookie('palette'), ['steel', 'terracotta', 'forest'], true)
                ? $request->cookie('palette')
                : 'steel',
        );

        return $next($request);
    }
}
