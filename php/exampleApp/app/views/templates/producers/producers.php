<?php include __DIR__ . '/../../partials/header.php'; ?>
<?php include __DIR__ . '/../../partials/navi.php'; ?>

    <div class="container">
        <?php include __DIR__.'/../../partials/msg.php'; ?>
        <div class="row">
            <div class="col-md-2">
                <?php include __DIR__ . '/partials/left_menu.php'; ?>
            </div>
            <div class="col-md-10">
                <div class="row">
                    <div class="col-md-12">
                        <?php
                        $data = '';
                        if (isset($this->assigned['producers'])) {
                            $data = "<table class='table table-hover table-bordered'>
                            <thead>
                            <tr>
                                <th scope='col'>ID</th>
                                <th scope='col'>Name</th>
                                <th scope='col'>Site Url</th>
                                <th scope='col'>logo_filename</th>
                                <th scope='col'>ordering</th>
                                <th scope='col'>source_id</th>
                            </tr>
                            </thead>
                            <tbody>";

                            foreach ($this->assigned['producers'] as $row) {
                                $data .= "<tr>
                                            <td>$row->id</td>
                                            <td>".htmlspecialchars($row->name)."</td>
                                            <td>$row->site_url</td>
                                            <td>$row->logo_filename</td >
                                            <td>$row->ordering</td>
                                            <td>$row->source_id</td>
                                        </tr>";
                            }
                            echo $data .= "</tbody></table>";
                        }else{
                            echo 'Producers no data!';
                        }
                        ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php include __DIR__ . '/../../partials/footer.php'; ?>