<?php


namespace App\Core\Interfaces\Http;


interface ResponseInterface
{
    public function withRedirect($url);

    public function render($output);
}
