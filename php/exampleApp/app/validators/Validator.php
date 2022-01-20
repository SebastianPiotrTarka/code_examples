<?php


namespace App\Validators;

use App\Core\Interfaces\Http\RequestInterface;
use App\Core\Interfaces\Validations\ValidationInterface;

class Validator extends BaseValidator implements ValidationInterface
{
    public function validate(RequestInterface $data, array $keyWithRules)
    {
        foreach ($keyWithRules as $key => $rules) {
            if ($data->exist($key) || $data->exist($key, 'POST')) {
                $this->paramName = $key;
                $this->paramValue = $data->get($key);
                foreach ($rules as $rule) {
                    $this->$rule();
                }
            } else {
                $this->addError('Param ' . $key . ' not exist in Request !');
            }
        }
    }

    public final function valid()
    {
        if (!empty($this->errors)) {
            return false;
        }

        return true;
    }
}
