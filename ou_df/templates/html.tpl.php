<?php
/**
 * @file
 * Overriding Drupal's html template.
 */
?>
<!DOCTYPE html>
<!--[if lt IE 8]><html lang="en-GB" class="no-js lt-ie8 lt-ie9"><![endif]-->
<!--[if (IE 8)&!(IEMobile)]><html lang="en-GB" class="no-js lt-ie9"><![endif]-->
<!--[if gt IE 8]><!--> <html lang="en-GB" class="no-js"><!--<![endif]-->
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <?php print $head; ?>
    <title><?php print $head_title; ?></title>

    <!-- favicons -->
    <link rel="apple-touch-icon" href="http://ou.jywng.co/styleguide/assets/img/favicons/apple-touch-icon.png">
    <link rel="icon" href="http://ou.jywng.co/styleguide/assets/img/favicons/favicon.png">
    <!--[if IE]><link rel="shortcut icon" href="http://ou.jywng.co/styleguide/assets/img/favicon.ico"><![endif]-->
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="http://ou.jywng.co/styleguide/assets/favicons/ie10-win8-tile-icon.png">

    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link href="//netdna.bootstrapcdn.com/font-awesome/4.0.2/css/font-awesome.css" rel="stylesheet">
    <script src="<?php print check_plain(file_create_url(path_to_theme() . '/Jwing/assets/js/vendor/modernizr-2.6.2.min.js')); ?>"></script>

    <?php print $styles; ?>
    <!--[if lt IE 8]>
    <link rel="stylesheet" href="<?php print path_to_theme(); ?>assets/css/ie.css">
    <![endif]-->
    <!--[if IE 7]>
    <link rel="stylesheet" href="<?php print path_to_theme(); ?>assets/css/ie7.css">
    <![endif]-->


    <?php print $scripts; ?>

  </head>
  <body marginwidth="0" marginheight="0" style="">

    <div id="int-site">
      <a href="#int-content" id="int-skip-link" class="btn-skip">
        <i class="int-icon int-icon-chevron-down"></i>
        <span> Skip to content</span>
      </a>
      <?php print $page_top; ?>
      <?php print $page; ?>
      <?php print $page_bottom; ?>
    </div>

    <input type="hidden" id="loaded-components" value="Can I do it">

    <!--[if lt IE 9]>
    <script src="http://ou.jywng.co/assets/js/ie.js"></script>
    <![endif]-->

    <script src="<?php print check_plain(file_create_url(path_to_theme() . '/Jwing/assets/js/vendor/jquery.placeholder.js')); ?>"></script>
    <script src="<?php print check_plain(file_create_url(path_to_theme() . '/Jwing/assets/js/vendor/jquery.smartresize.js')); ?>"></script>
    <script src="<?php print check_plain(file_create_url(path_to_theme() . '/Jwing/assets/js/vendor/cookies.js')); ?>"></script>
    <script src="<?php print check_plain(file_create_url(path_to_theme() . '/Jwing/assets/js/vendor/jquery-accessibleMegaMenu.js')); ?>"></script>

    <script src="<?php print check_plain(file_create_url(path_to_theme() . '/Jwing/assets/js/app.js')); ?>"></script>
    <script src="<?php print check_plain(file_create_url(path_to_theme() . '/Jwing/assets/js/helpers.js')); ?>"></script>

    <script src="<?php print check_plain(file_create_url(path_to_theme() . '/Jwing/assets/js/modules/global.primarynavigation_1.js')); ?>"></script>
    <script src="<?php print check_plain(file_create_url(path_to_theme() . '/Jwing/assets/js/modules/navigation.js')); ?>"></script>
<!--    <script src="--><?php //print check_plain(file_create_url(path_to_theme() . '/Jwing/assets/js/cookiesbar.js')); ?><!--"></script>-->
    <script src="<?php print check_plain(file_create_url(path_to_theme() . '/Jwing/assets/js/modules/ui-widgets.js')); ?>"></script>
    <script src="<?php print check_plain(file_create_url(path_to_theme() . '/Jwing/assets/js/modules/course-details.js')); ?>"></script>
    <script src="<?php print check_plain(file_create_url(path_to_theme() . '/Jwing/assets/js/modules/back-to-top.js')); ?>"></script>
    <script src="<?php print check_plain(file_create_url(path_to_theme() . '/Jwing/assets/js/modules/modal.js')); ?>"></script>

    <script src="<?php print check_plain(file_create_url(path_to_theme() . '/Jwing/assets/js/styleguide.js')); ?>"></script>

  </body>
</html>
