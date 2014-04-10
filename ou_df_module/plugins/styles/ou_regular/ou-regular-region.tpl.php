<?php
drupal_add_css(drupal_get_path('module','example_styles') .'/plugins/styles/example_styles/example.css', array('group' => CSS_DEFAULT, 'every_page' => TRUE));
?>
<?php if(is_object($content )): ?>
  <?php print render($content->content); ?>
<?php else: ?>
  <?php print $content; ?>
<?php endif; ?>