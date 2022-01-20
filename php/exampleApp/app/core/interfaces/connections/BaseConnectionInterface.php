<?php

namespace App\Core\Interfaces\Connections;

interface BaseConnectionInterface
{
    public function connect();

    public function prepare($name, $param);

    public function exec();

    public function close();
}
