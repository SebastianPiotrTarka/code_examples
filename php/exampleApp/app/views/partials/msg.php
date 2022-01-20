<?php
$render = '';

if (isset($this->assigned['info'])) {
    $render = "<div class='alert alert-info'>".$this->assigned['info']."</div>";
}

if (isset($this->assigned['error'])) {
    $render .= "<div class='alert alert-danger'>".$this->assigned['error']."</div>";
}

if($render){
    echo $render;
}
?>
