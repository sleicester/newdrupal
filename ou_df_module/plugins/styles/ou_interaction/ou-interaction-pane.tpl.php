<?php
drupal_add_css(drupal_get_path('module','example_styles') .'/plugins/styles/example/example.css', array('group' => CSS_DEFAULT, 'every_page' => TRUE)); ?>
<div class="interaction">
  <div class="int-container">
    <?php if (!empty($settings['hr_top'])): ?>
      <hr />
    <?php endif; ?>
    <?php if (!empty($content->title)): ?>
      <h2><?php echo $content->title; ?></h2>
    <?php endif; ?>
      <?php print render($content->content); ?>
    <?php if (!empty($settings['hr_bottom'])): ?>
      <hr />
    <?php endif; ?>
  </div>
</div>
