<?php

namespace App\Models\Entities;


use App\Core\Interfaces\Entities\jsonInterface;

class Producer extends Entity implements jsonInterface
{

    const OBJECT_NAME = 'producer';
    /**
     * @var $id integer
     */
    protected $id;
    /**
     * @var $name string
     */
    protected $name;

    /**
     * @var $site_url string
     */
    protected $site_url;

    /**
     * @var $logo_filename string
     */
    protected $logo_filename;

    /**
     * @var $ordering integer;
     */
    protected $ordering;

    /**
     * @var $source_id string
     */
    protected $source_id;

    /**
     * Return instances like a JSON string
     * @return string
     */
    public function getDataAsJson()
    {
        return json_encode([
            self::OBJECT_NAME => [
                'id' => $this->id,
                'name' => $this->name,
                'site_url' => $this->site_url,
                'logo_filename' => $this->logo_filename,
                'ordering' => $this->ordering,
                'source_id' => $this->source_id
            ]
        ]);
    }
}
