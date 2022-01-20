<?php


namespace App\Validators;


use App\Core\Interfaces\Http\RequestInterface;

abstract class BaseValidator
{
    protected $errors = [];

    protected $paramName;

    protected $paramValue;

    protected $flag = false;

    protected function notEmpty()
    {
        if (!$this->paramName) {
            $this->addError('Param is not set!');
        } elseif (!empty($this->paramValue)) {
            $this->flag = true;
        } else {
            $this->addError('Param ' . $this->paramName . ' is empty!');
        }

        return $this->flag;
    }

    protected function isUrl()
    {
        if (!$this->paramName) {
            $this->addError('Param is not set!');
        } elseif (filter_var($this->paramValue, FILTER_VALIDATE_URL)) {
            $this->flag = true;
        } else {
            $this->addError('Param ' . $this->paramName . ' is not url!');
        }

        return $this->flag;
    }

    public final function addError($msg)
    {
        $this->errors[] = $msg;
    }

    public final function getErrors()
    {
        return $this->errors;
    }

    public function __call($name, $arguments)
    {
        $this->addError('Validation method '.$name.' not exist, or params pass are wrong!');
    }
}
