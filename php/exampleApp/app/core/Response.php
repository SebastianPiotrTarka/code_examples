<?php


namespace App\Core;


use App\Core\Interfaces\Http\ResponseInterface;

class Response implements ResponseInterface
{
    public function withRedirect($url)
    {
        header('Location:'.$url);
        die();
    }

    public function render($output)
    {
        echo $output;
        die();
    }

}
