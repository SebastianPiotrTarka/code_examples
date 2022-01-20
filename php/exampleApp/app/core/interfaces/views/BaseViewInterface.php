<?php

namespace App\Core\Interfaces\views;

interface BaseViewInterface
{
    public function assign($param, $value);

    public function execute($file);
}
