<?php


namespace App\Models;


use App\Core\Interfaces\Connections\BaseConnectionInterface;
use App\Core\Interfaces\Entities\jsonInterface;
use App\Core\Model;

class Producers extends Model
{
    private $url;

    public function __construct(BaseConnectionInterface $c, $url)
    {
        parent::__construct($c);
        $this->url = $url;
    }

    public function getAll()
    {
        return json_decode($this->connHandler->get($this->url));
    }

    public function addOne(jsonInterface $jsonData)
    {
        return json_decode($this->connHandler->post($this->url, $jsonData, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => array('Content-Type: application/json')]
        ));

    }
}
