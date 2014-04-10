<?php
drupal_add_css(drupal_get_path('module','example_styles') .'/plugins/styles/example_styles/example.css', array('group' => CSS_DEFAULT, 'every_page' => TRUE));
?>

      <?php print render($content->content); ?>
