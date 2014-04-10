<?php
drupal_add_css(drupal_get_path('module','example_styles') .'/plugins/styles/example/example.css', array('group' => CSS_DEFAULT, 'every_page' => TRUE)); ?>
<div class="int-promo">
  <div class="int-container">
    <div class="int-notice">
      <?php if (!empty($settings['hr_top'])): ?>
        <hr />
      <?php endif; ?>
      <div class="pane-content">
        <?php print render($content->content); ?>
      </div>
      <?php if (!empty($settings['hr_bottom'])): ?>
        <hr />
      <?php endif; ?>
    </div>
  </div>
</div>