<?php


namespace App\Core;


use App\Controllers\DefaultController;
use App\Core\Interfaces\Connections\BaseConnectionInterface;
use App\Core\Interfaces\views\BaseViewInterface;

class Controller
{
    const END_CLASS_NAME = 'Controller';
    const NAMESPACE_BEGIN = '\\App\\Controllers\\';

    private $viewEngine;
    private $connectionHandler;

    public function __construct(BaseViewInterface $v,BaseConnectionInterface $c = null)
    {
        $this->viewEngine = $v;
        $this->connectionHandler = $c;
    }

    public function selectByRequest()
    {
        if (isset($_REQUEST['controller']) && isset($_REQUEST['action'])) {
            $controllerClassName = self::NAMESPACE_BEGIN . ucfirst($_REQUEST['controller']) . self::END_CLASS_NAME;
            $action = $_REQUEST['action'];
            $c = new $controllerClassName($this->viewEngine,$this->connectionHandler);
            $c->{$action}(new Request(),new Response());
        } else {
            $c = new DefaultController($this->viewEngine,$this->connectionHandler);
            $c->index(new Request(), new Response());
        }
    }
}
