<?php


namespace App\Controllers;


use App\Core\Request;
use App\Core\Response;

class DefaultController extends Controller
{
    public function index( Request $request, Response $response)
    {
        $this->view->assign('test', 'Welcome on site for my new Job');
        return $response->render( $this->view->execute(__DIR__ . '/../views/app.php'));
    }
}
