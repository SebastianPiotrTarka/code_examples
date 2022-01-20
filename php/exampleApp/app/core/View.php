<?php


namespace App\Core;

use App\Core\Interfaces\views\BaseViewInterface;

class View implements BaseViewInterface
{
    private $assigned = [];


    public function assign($param, $value)
    {
        $this->assigned[$param] = $value;
    }

    public function execute($template)
    {

        $output = $temp = file_get_contents($template);

        preg_match('[@extend (.*) @end]', $output, $extend);

        if ($extend) {
            $extend = str_replace("'", '', $extend[1]);
            $temp = file_get_contents(__DIR__ . '/../' . $extend);
            $output = str_replace('[@extend \'' . $extend . '\' @end]', $temp, $output);
        }

        preg_match_all('[@include (.*) @end]', $output, $inludes);

        foreach ($inludes[1] as $include) {
            $include = str_replace("'", "", $include);
            $outputInclude = file_get_contents(__DIR__ . '/../' . $include);
            $output = str_replace('[@include \'' . $include . '\' @end]', $outputInclude, $output);
        }

        preg_match_all('[@block (.*) @end]', $output, $blocks);
        foreach ($blocks[1] as $key => $block) {
            preg_match('/\[\@block ' . $block . '\](.|\n)*?\[\@end]/', $output, $dataToReplace);
            $output = str_replace($dataToReplace, '', $output);
            $output = str_replace('[' . $blocks[0][$key] . ']', $dataToReplace[0], $output);
//           example: /\[\@block content\](.|\n)*?\[\@end]/

        }

        foreach ($blocks[1] as $block) {
            $output = str_replace('[@block ' . $block . ']', '', $output);
        }
        $output = str_replace('[@end]', '', $output);

        foreach ($this->assigned as $key => $value) {
            $tagToReplace = "[@$key]";
            $output = str_replace($tagToReplace, $value, $output);
        }

        preg_match('/\[\@foreach (.*)](.|\n)*?\[\@foreachend]/', $output, $foreachLops, PREG_OFFSET_CAPTURE, 0);
        foreach ($foreachLops[0] as $lop) {
            foreach ($this->assigned as $key => $item) {
                if (is_array($item)) {
                    if (strstr($lop, '@' . $key)) {

                        preg_match('/\[\@foreach\s(.*)\s(as)\s\@.*/', $lop, $lopHead,PREG_SET_ORDER, 0);
                        $map = explode(' ', str_replace(['[', ']'], '', $lopHead));
                        $stop = 1;
                    }
                }
            }

        }

        return $output;
    }
}
