<?php


namespace App\Core;


use App\Core\Interfaces\Http\RequestInterface;

class Request implements RequestInterface
{
    public function getParams($type = 'GET')
    {
        return $GLOBALS['_'.$type];
    }

    public function getParam($key, $type = 'GET')
    {
        return $GLOBALS['_'.$type][$key];
    }

    public function exist($key, $type = 'GET')
    {
        return isset($GLOBALS['_'.$type][$key]);
    }

    public function get($key)
    {
        if(isset($_GET[$key])){
            return $_GET[$key];
        }elseif (isset($_POST[$key])){
            return $_POST[$key];
        }

        return null;
    }


}
