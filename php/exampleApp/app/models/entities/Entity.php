<?php


namespace App\Models\Entities;


abstract class Entity
{
    /**
     * @param array $source
     * @return
     */
    public static function initFromArray(array $source)
    {
        $callClass = get_called_class();
        $callClass = new $callClass();
        foreach ($source as $key => $value){
            $callClass->{$key} = $value;
        }

        return $callClass;
    }
}
