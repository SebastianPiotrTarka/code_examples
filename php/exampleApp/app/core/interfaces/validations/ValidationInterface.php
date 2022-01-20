<?php

namespace App\Core\Interfaces\Validations;


use App\Core\Interfaces\Http\RequestInterface;

interface ValidationInterface
{
    public function validate(RequestInterface $data, array $keyWithRules);

    public function valid();

    public function getErrors();
}
