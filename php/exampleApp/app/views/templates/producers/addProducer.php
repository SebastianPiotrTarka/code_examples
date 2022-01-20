<?php include __DIR__ . '/../../partials/header.php'; ?>
<?php include __DIR__ . '/../../partials/navi.php'; ?>


    <div class="container">
        <?php include __DIR__ . '/../../partials/msg.php'; ?>
        <div class="row">
            <div class="col-md-2">
                <a class="btn btn-primary" href="?controller=producers&action=getAll" title="Show all producers">Show
                    All Producers</a>
            </div>
            <div class="col-md-10">
                <div id="add-producer-form" class="panel panel-default">
                    <div class="panel-heading">Add new producer</div>
                    <form action="?controller=producers&action=postAdd" method="post">
                        <div class="panel-body">
                            <div class="form-group">
                                <label for="name">Producers name:</label>
                                <input name="name" type="text" class="form-control" id="name" placeholder="name"
                                       value="<?php
                                       if (isset($this->assigned['old'])) {
                                           echo $this->assigned['old']['name'];
                                       }
                                       ?> ">
                                <!--                                {% if errors.name %}-->
                                <!--                                <span class="help-block">{{ errors.name | first }}</span>-->
                                <!--                                {% endif %}-->
                            </div>
                            <div class="form-group ">
                                <label for="site_url">Site Url:</label>
                                <input name="site_url" type="text" class="form-control" id="site_url"
                                       placeholder="http://producer.domain" value="<?php
                                if (isset($this->assigned['old'])) {
                                    echo $this->assigned['old']['site_url'];
                                }
                                ?>">
                                <!--                                {% if errors.site_url %}-->
                                <!--                                <span class="help-block">{{ errors.site_url | first }}</span>-->
                                <!--                                {% endif %}-->
                            </div>
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-md-6">
                                        <label for="logo_file">Upload logo:</label>
                                        <input name="logo_file" type="file" class="form-control" id="logo_file"
                                               placeholder="Add Producer Logo">
                                    </div>
                                    <div class="col-md-6">
                                        <label for="source_id">Source Id:</label>
                                        <input name="source_id" type="text" class="form-control" id="source_id"
                                               placeholder="Unique source_id" value="<?php
                                        if (isset($this->assigned['old'])) {
                                            echo $this->assigned['old']['source_id'];
                                        }
                                        ?>">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="panel-footer">
                            <button type="submit" class="btn btn-primary">Add</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
<?php include __DIR__ . '/../../partials/footer.php'; ?>