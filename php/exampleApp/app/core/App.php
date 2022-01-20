<?php


namespace App\Core;


use App\Core\Exceptions\ControllerException;

class App
{
    /**
     * @var array $settings
     */
    private $settings;

    /**
     * @var Controller $controller
     */
    private $controller;

    public function __construct(array $settings = null)
    {
        $this->settings = $settings;

    }

    public function run()
    {
        $this->controllerInit();
        $this->controller->selectByRequest();
    }

    private function controllerInit()
    {
        if (isset($this->settings['view']) && isset($this->settings['connection'])) {
            $this->controller = new Controller($this->settings['view'], $this->settings['connection']);
        } elseif (isset($this->settings['view']) && !isset($this->settings['connection'])) {
            $this->controller = new Controller($this->settings['view']);
        } else {
            throw new ControllerException("Valid controller construct params!");
        }

    }


}
