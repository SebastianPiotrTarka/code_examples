<?php


namespace App\Core;


use App\Core\Interfaces\views\BaseViewInterface;

class BaseView implements BaseViewInterface
{

    public $assigned = [];

    public function assign($param, $value)
    {
        $this->assigned[$param] = $value;
    }

    public function execute($file)
    {
        ob_start();

        include $file;

        return ob_get_clean();
    }

}
