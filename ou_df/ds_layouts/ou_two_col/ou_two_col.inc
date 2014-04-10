<?php

/**
 * @file
 * Display Suite OU Article configuration.
 */

function ds_ou_two_col() {
  return array(
    'label' => t('OU Two Column'),
    'regions' => array(
      'body' => t('Body'),
      'media' => t('Media'),
    ),
    // Uncomment if you want to include a CSS file for this layout (ou_two_col.css)
    'css' => FALSE,
    // Uncomment if you want to include a preview for this layout (ou_two_col.png)
    // 'image' => TRUE,
  );
}
