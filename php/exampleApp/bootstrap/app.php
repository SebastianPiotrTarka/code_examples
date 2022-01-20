<?php
//error_reporting(E_ALL);

require __DIR__ . '/../vendor/autoload.php';

$app = new \App\Core\App([
    'api' => [
        'url' => env('URL_API'),
        'login' => env('USER_API'),
        'password' => env('PASSWORD_API')
    ],
    'view' => new \App\Core\BaseView(),
    'connection' => new \App\Core\CurlClient(env('URL_API'), 'rest', env('PASSWORD_API'))
]);



