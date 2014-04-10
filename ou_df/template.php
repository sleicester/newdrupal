<?php

/**
 * Implements hook_theme().
 */
function ou_df_theme() {
  return array(
    'grid_row' => array(
      'render element' => 'element',
    ),
    'grid_col' => array(
      'render element' => 'element',
    ),
  );
}

/**
 * Implements hook_theme_registry_alter().
 */
function ou_df_theme_registry_alter(&$registry) {
  // Our preprocess function needs to go before the silly
  // template_preprocess_menu_tree.
  $index = array_search('ou_df_preprocess_menu_tree', $registry['menu_tree']['preprocess functions']);
  if ($index !== FALSE) {
    unset($registry['menu_tree']['preprocess functions'][$index]);
    array_unshift($registry['menu_tree']['preprocess functions'], 'ou_df_preprocess_menu_tree');
  }
}

/**
 * Implements hook_css_alter().
 */
function ou_df_css_alter(&$css) {
  unset($css[drupal_get_path('module', 'field_collection') . '/field_collection.theme.css']);
  unset($css[drupal_get_path('module', 'system') . '/system.menus.css']);
}

/**
 * Return HTML for a menu link.
 *
 * Our theme requires all menu links are wrapped with an inner span tag.
 */
function ou_df_menu_link(&$variables) {
  $element = $variables['element'];
  $sub_menu = '';

  if ($element['#below']) {
    $sub_menu = drupal_render($element['#below']);
  }

  $title = $element['#title'];
  if (empty($element['#localized_options']['html'])) {
    $title = check_plain($title);
  }
  $element['#localized_options']['html'] = TRUE;
  $output = l('<span>' . $title . '</span>', $element['#href'], $element['#localized_options']);

  if (in_array('active', $element['#attributes']['class']) || in_array('active-trail', $element['#attributes']['class'])) {
    $element['#attributes']['class'][] = 'int-nav-active';
  }
  return '<li' . drupal_attributes($element['#attributes']) . '>' . $output . $sub_menu . "</li>\n";
}

/**
 * Implements hook_block_view_alter().
 */
function ou_df_block_view_alter(&$data, $block) {
  if ($block->module == 'menu_block') {
    if ($block->delta == 'ou-df-main-menu') {
      $data['content']['#content']['#theme_wrappers'][0] = 'menu_tree__menu_block__ou_main';
    }
  }
}

/**
 * Return HTML for a menu when rendering on a panels page sub menu.
 *
 * @ingroup themeable.
 */
function ou_df_menu_tree__menu_block__ou_df_panel_sub_menu(&$variables) {
  return '<ul class="int-striped-list">' . $variables['tree'] . '</ul>';
}


/**
 * Theme function for the breadcrumb.
 *
 * @param Assoc $variables
 *   arguments
 *
 * @return string
 *   HTML for the themed breadcrumb.
 */
function ou_df_easy_breadcrumb($variables) {

  $breadcrumb = $variables['breadcrumb'];
  $segments_quantity = $variables['segments_quantity'];
  $separator = $variables['separator'];

  $html = '';

  if ($segments_quantity > 0) {

    $html .= '<dl class="breadcrumb"><dt>You are here:</dt><dd>';

    for ($i = 0, $s = $segments_quantity - 1; $i < $segments_quantity; ++$i) {
      $it = $breadcrumb[$i];
      $content = decode_entities($it['content']);
      if (isset($it['url'])) {
        $html .= l($content, $it['url'], array('attributes' => array('class' => $it['class'])));
      } else {
        $class = implode(' ', $it['class']);
        $html .= '<span class="' . $class . '">'	. $content . '</span>';
      }
      if ($i < $s) {
        $html .= '<span class="easy-breadcrumb_segment-separator"> ' . $separator . ' </span>';
      }
    }

    $html .= '</dd></dl>';
  }

  return $html;
}

/**
 * Implements hook_ENTITY_TYPE_view_alter().
 */
function ou_df_fieldable_panels_pane_view_alter(&$element) {
  $element['#pre_render'][] = 'ou_df_pre_render_grid_entity';
}

/**
 * Pre render function for grid based rendering of a field.
 */
function ou_df_pre_render_grid_entity($element) {

  // Breaking with naming convention here to avoid RSI.
  $fpp_wrapper = entity_metadata_wrapper('fieldable_panels_pane', $element['#element']);

  if (isset($fpp_wrapper->field_grid_columns)) {
    $col_width = $fpp_wrapper->field_grid_columns->value();

    $fields = array('field_referenced_items');
    foreach ($fields as $field_name) {
      if (isset($fpp_wrapper->$field_name)) {
        // Format field X to have each item col width Y wide.
        if (isset($field_name) && $col_width) {
          $element[$field_name]['#theme_wrappers'][] = 'grid_row';
          foreach ($element[$field_name]['#items'] as $delta => $item) {
            $element[$field_name][$delta]['#theme_wrappers'][] = 'grid_col';
            $element[$field_name][$delta]['#grid_cols'] = $col_width;
          }
        }
      }
    }
  }

  return $element;
}


function ou_df_preprocess_fieldable_panels_pane(&$variables){
  if ($variables['elements']['#entity_type'] == 'fieldable_panels_pane') {
    if (in_array($variables['elements']['#bundle'], array('text_and_image', 'text_and_media'))) {
      $entity = $variables['elements']['#element'];
      $wrapped_entity = entity_metadata_wrapper('fieldable_panels_pane', $entity);
      $type = $wrapped_entity->field_two_col_display_type->value();
      $position = $wrapped_entity->field_two_col_content_on->value();

      $start_pos = $type;
      $end_pos = 12 - $type;

      $order = array('body' => ' int-grid' . $start_pos, 'media' => ' int-grid' . $end_pos);
      if ($position == 'Flipped') {
        $order = array_reverse($order);
      }
      $variables['ds_region_order'] = $order;
    }
  }

}

/**
 * Implements hook_preprocess_HOOK() for block.tpl.php.
 */
function ou_df_preprocess_block(&$variables) {
  $block = $variables['block'];
  // Allow the standard wrappers to come through if contextual links exist on
  // the block.
  if ($block->module == 'system' && $block->delta == 'main' && empty($variables['title_prefix'])) {
    $variables['theme_hook_suggestions'][] = 'block__no_wrappers';
  }
}

/**
 * Implements hook_preprocess_HOOK() for region.tpl.php.
 */
function ou_df_preprocess_region(&$variables) {
  if ($variables['region'] == 'content') {
    $variables['theme_hook_suggestions'][] = 'region__no_wrappers';
  }
}

/**
 * Return HTML for a CSS row.
 *
 * @ingroup themeable.
 */
function ou_df_grid_row($variables) {
  return '<div class="int-row">' . $variables['element']['#children'] . '</div>';
}

/**
 * Return HTML for a CSS column.
 *
 * @ingroup themeable.
 */
function ou_df_grid_col($variables) {
  $cols = $variables['element']['#grid_cols'];
  return "<article class=\"int-grid{$cols}\">" . $variables['element']['#children'] . '</article>';
}

/**
 * Implements hook_preprocess_HOOK() for theme_field().
 */
function ou_df_preprocess_field(&$variables) {
  $element = $variables['element'];
  if (!empty($element['#theme_wrappers']) && array_search('grid_row', $element['#theme_wrappers']) !== FALSE) {
    $variables['theme_hook_suggestions'] = array('theme_ds_field_reset');
  }

  if ($element['#field_name'] === 'field_thumbnail' && isset($element['#object']->field_image_is_video)) {
    _ou_df_preprocess_thumbnail($variables);
  }
}

/**
 * Handle the rendering of a thumbnail with optional link to content and video.
 */
function _ou_df_preprocess_thumbnail(&$variables) {
  $element = $variables['element'];
  $href = '#';
  if (isset($element['#object']->field_entity_items)) {
    $ref = entity_metadata_wrapper($element['#entity_type'], $element['#object'])->field_entity_items;
    if ($ref->value()) {
      $uri = entity_uri($ref->type(), $ref->value());
      $href = url($uri['path'], $uri['options']);
    }
  }

  $is_video = entity_metadata_wrapper($element['#entity_type'], $element['#object'])->field_image_is_video->value();
  if ($is_video) {
    $variables['items'][0]['#prefix'] = "<div class=\"int-video-link\"><a href=\"$href\"><div><div class=\"int-icon int-icon-3x int-icon-youtube-play\"></div></div>";
    $variables['items'][0]['#suffix'] = '</a></div>';
  }
  elseif ($href !== '#') {
    $variables['items'][0]['#prefix'] = "<a href=\"$href\">";
    $variables['items'][0]['#suffix'] = '</a>';
  }
}
