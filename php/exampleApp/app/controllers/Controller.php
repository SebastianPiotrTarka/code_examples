<?php

namespace App\Controllers;


use App\Core\Interfaces\Connections\BaseConnectionInterface;
use App\Core\Interfaces\views\BaseViewInterface;

abstract class Controller
{
    /**
     * @var BaseViewInterface
     */
    protected $view;
    /**
     * @var BaseConnectionInterface $conn
     */
    protected $connectionHandler;

    public function __construct(BaseViewInterface $view, BaseConnectionInterface $conn = null)
    {
        $this->view = $view;
        $this->connectionHandler = $conn;
    }

}
