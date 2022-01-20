<?php


namespace App\Controllers;


use App\Core\Request;
use App\Core\Response;
use App\Models\Entities\Producer;
use App\Models\Producers;
use App\Validators\Validator;

class ProducersController extends Controller
{
    public function getAll(Request $request, Response $response)
    {
        $producers = new Producers($this->connectionHandler, 'producers');

        $result = $producers->getAll();
        if ($result->success) {
            $this->view->assign('producers', $result->data->producers);
        } else {
            $this->view->assign('error', 'Get Producers fail! ' . $result->error->reason_code . ', ' . $result->error->messages[0]);
        }

        return $response->render($this->view->execute(__DIR__ . '/../views/templates/producers/producers.php'));
    }

    public function getAdd(Request $request, Response $response)
    {
        return $response->render($this->view->execute(__DIR__ . '/../views/templates/producers/addProducer.php'));
    }

    public function postAdd(Request $request, Response $response)
    {
        $validation = new Validator();
        $validation->validate($request, [
            'name' => ['notEmpty'],
            'site_url' => ['notEmpty', 'isUrl']
        ]);

        if (!$validation->valid()) {
            $this->view->assign('error', implode('<br>', $validation->getErrors()));
            return $response->render($this->view->execute(__DIR__ . '/../views/templates/producers/addProducer.php'));
        }

        $producerModel = new Producers($this->connectionHandler, 'producers');
        $producer = Producer::initFromArray($request->getParams('POST'));
        $result = $producerModel->addOne($producer);

        if ($result->success) {
            $this->view->assign('info', 'Producer add success!');
        } else {
            $this->view->assign('error', 'Producer add fail! ' . $result->error->reason_code . ', ' . $result->error->messages[0]);
            $this->view->assign('old', $request->getParams('POST'));
        }

        return $response->render($this->view->execute(__DIR__ . '/../views/templates/producers/addProducer.php'));
    }

}
