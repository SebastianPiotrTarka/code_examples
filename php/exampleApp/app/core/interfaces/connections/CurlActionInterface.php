<?php


namespace App\Core\Interfaces\Connections;


use App\Core\Interfaces\Entities\jsonInterface;

interface CurlActionInterface extends BaseConnectionInterface
{
    public function get($url, array $params);

    public function post($url,jsonInterface $data, array $params);

}
