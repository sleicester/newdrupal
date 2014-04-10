<?php

/**
 * @file
 * Default theme implementation to display a single Drupal page while offline.
 *
 * All the available variables are mirrored in html.tpl.php and page.tpl.php.
 * Some may be blank but they are provided for consistency.
 *
 * @see template_preprocess()
 * @see template_preprocess_maintenance_page()
 *
 * @ingroup themeable
 */
?>
<!DOCTYPE html>
<!--[if IE 7]>    <html lang="<?php print $language->language; ?>" dir="<?php print $language->dir; ?>" class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>    <html lang="<?php print $language->language; ?>" dir="<?php print $language->dir; ?>" class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html id="doc"  lang="<?php print $language->language; ?>" dir="<?php print $language->dir; ?>" class="no-js"> <!--<![endif]-->
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <?php print $head; ?>
  <title><?php print $head_title; ?></title>

  <link type="text/css" rel="stylesheet" href="//fast.fonts.com/cssapi/5864a5b0-6ea9-4f50-9d60-cec391d45bf0.css"/>
  <?php print $styles; ?>
  <!-- HTML5 element support for IE6-8 -->
  <!--[if lt IE 9]>
  <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->
  <?php print $scripts; ?>
</head>
<body class="user-page-form <?php print $classes; ?>" <?php print $attributes;?>>
<div id="skip-link">
  <a href="#main-content" class="element-invisible element-focusable"><?php print t('Skip to main content'); ?></a>
</div>

<div id="main-wrapper">
  <div id="main" class="container">
    <div class="row-fluid">
      <section>

        <a id="main-content"></a>
        <?php print render($title_prefix); ?>
        <?php if (!empty($title)): ?>
          <h1 class="page-header"><?php print $title; ?></h1>
        <?php endif; ?>
        <?php print render($title_suffix); ?>

        <?php print $messages; ?>

        <?php if (!empty($tabs)): ?>
          <?php print render($tabs); ?>
        <?php endif; ?>
        <div class="row-fluid">
          <div class="span6 offset3 well white-well">
            <?php print $content; ?>
          </div>
        </div>


      </section>
    </div>
  </div>
</div>

</body>
</html>
