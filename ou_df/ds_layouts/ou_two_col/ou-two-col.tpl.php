<?php
/**
 * @file
 * Display Suite OU Article template.
 *
 * Available variables:
 *
 * Layout:
 * - $classes: String of classes that can be used to style this layout.
 * - $contextual_links: Renderable array of contextual links.
 * - $layout_wrapper: wrapper surrounding the layout.
 *
 * Regions:
 *
 * - $body: Rendered content for the "body" region.
 * - $body_classes: String of classes that can be used to style the "body" region.
 *
 * - $body: Rendered content for the "Body" region.
 * - $body_classes: String of classes that can be used to style the "Body" region.
 */
?>
<<?php print $layout_wrapper; print $layout_attributes; ?> class="<?php print $classes;?> clearfix">
  <!-- Needed to activate contextual links -->
  <?php if (isset($title_suffix['contextual_links'])): ?>
    <?php print render($title_suffix['contextual_links']); ?>
  <?php endif; ?>
<?php print '<div class="int-row">'; ?>
  <?php foreach($variables['ds_region_order'] as $key => $extra_classes): ?>
    <<?php print ${$key . '_wrapper'}; ?> class="ds-body<?php print ${$key . '_classes'}; print $extra_classes;?>">
      <?php print $$key; ?>
    </<?php print ${$key . '_wrapper'}; ?>>
  <?php endforeach; ?>
<?php print '</div>'; ?>
</<?php print $layout_wrapper ?>>

<!-- Needed to activate display suite support on forms -->
<?php if (!empty($drupal_render_children)): ?>
  <?php print $drupal_render_children ?>
<?php endif; ?>
