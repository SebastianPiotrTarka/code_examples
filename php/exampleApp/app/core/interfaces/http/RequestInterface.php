<?php


namespace App\Core\Interfaces\Http;

interface RequestInterface
{
    public function getParams($type = 'GET');

    public function getParam($key, $type = 'GET');

    public function exist($key, $type = 'GET');

    public function get($key);

}
