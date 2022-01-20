<?php


namespace App\Core;


use App\Core\Interfaces\Connections\BaseConnectionInterface;
use App\Core\Interfaces\Entities\jsonInterface;

abstract class Model
{
    protected $connHandler;

    public function __construct(BaseConnectionInterface $c)
    {
        $this->connHandler = $c;
    }

    abstract public function getAll();

    abstract public function addOne(jsonInterface $jsonData);

}
