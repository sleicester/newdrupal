<?php
/**
 * @file
 * 'Wrapper: Element' style.
 */

$plugin =  array(
  'ou_interaction' => array(
    'title' => t('OU: Interaction'),
    'description'   => t('OU Interaction Style'),
    'render pane' => 'ou_interaction_render_pane',
    'render region' => 'ou_interaction_render_region',
    'pane settings form' => 'ou_interaction_settings_form',
    'hook theme'    => array(
      'ou_interaction_pane' => array(
        'template' => 'ou-interaction-pane',
        'path' => drupal_get_path('module', 'ou_df_module') .'/plugins/styles/ou_interaction',
        'variables' => array(
          'content' => NULL,
          'settings' => NULL,
        ),
      ),
      'ou_interaction_region' => array(
        'template' => 'ou-interaction-region',
        'path' => drupal_get_path('module', 'ou_df_module') .'/plugins/styles/ou_interaction',
        'variables' => array(
          'content' => NULL,
        ),
      ),
    ),
  ),
);

function theme_ou_interaction_render_region($vars) {
  $content = '';

  foreach ($vars['panes'] as $pane_id => $pane_output) {

    $content .= $pane_output;
  }
  if (empty($content)) {
    return;
  }
  return theme('ou_interaction_region', array('content' => $content));
}

function theme_ou_interaction_render_pane(&$vars) {
  $settings = $vars['settings'];
  $content = $vars['content'];
  return theme('ou_interaction_pane', array('content' => $content, 'settings' => $settings));
}

function ou_interaction_settings_form($style_settings) {
  $form['hr_top'] = array(
    '#type' => 'checkbox',
    '#title' => t('Horizontal rule on top'),
    '#default_value' => (isset($style_settings['hr_top'])) ? $style_settings['hr_top'] : FALSE,
  );

  $form['hr_bottom'] = array(
    '#type' => 'checkbox',
    '#title' => t('Horizontal rule on bottom'),
    '#default_value' => (isset($style_settings['hr_bottom'])) ? $style_settings['hr_bottom'] : FALSE,
  );

  return $form;
}