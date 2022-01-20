<?php


namespace App\Core;


use App\Core\Interfaces\Connections\BaseConnectionInterface;
use App\Core\Interfaces\Connections\CurlActionInterface;
use App\Core\Interfaces\Entities\jsonInterface;

class CurlClient implements BaseConnectionInterface,CurlActionInterface
{
    private $curlResource;
    private $url, $baseUrl;
    private $user;
    private $pass;

    public function __construct($url, $user = null, $pass = null)
    {
        $this->url = $this->baseUrl = $url;
        $this->user = $user;
        $this->pass = $pass;

        $this->connect();

    }

    public function connect()
    {
        $this->curlResource = curl_init($this->url);
        if ($this->user && $this->pass) {
            $this->prepare(CURLOPT_USERPWD, $this->user . ':' . $this->pass);
        }
    }

    public function prepare($name, $value)
    {
        curl_setopt($this->curlResource, $name, $value);
    }

    public function setParams(array $params)
    {
        foreach ($params as $option => $value) {
            $this->prepare($option, $value);
        }
    }

    public function exec()
    {
        return curl_exec($this->curlResource);
    }

    public function close()
    {
        curl_close($this->curlResource);
    }

    public function setUrl($url)
    {
        $this->url = $this->baseUrl . $url;
    }

    public function getUrl()
    {
        return $this->url;
    }

    public function get($url, array $params = null)
    {
        $this->setUrl($url);
        $params[CURLOPT_RETURNTRANSFER] = true;
        $params[CURLOPT_URL] = $this->getUrl();

        $this->setParams($params);

        return $this->exec();
    }

    public function post($url, jsonInterface $data, array $params)
    {
        $this->setUrl($url);
        $params[CURLOPT_RETURNTRANSFER] = true;
        $params[CURLOPT_URL] = $this->getUrl();
        $params[CURLOPT_POSTFIELDS] = $data->getDataAsJson();

        $this->setParams($params);

        return $this->exec();
    }

}
