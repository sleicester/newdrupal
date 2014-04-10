<?php
/**
 * @file
 * Overriding Drupal's page template.
 */
?>

<!-- Cookies Bar -->
<?php if (!empty($page['bar'])): ?>
  <div id="int-cookies-bar" class="int-cookies-bar int-active">
    <div class="interaction">
      <div class="int-container">
        <?php print render($page['bar']); ?>
      </div>
    </div>
  </div>
<?php endif; ?>
<!-- /Cookies Bar -->

<!-- Site Header -->
<header role="banner">
  <?php if (!empty($page['header'])): ?>
     <?php print render($page['header']); ?>
  <?php endif; ?>
</header>
<!-- /Site Header -->

<?php if ($messages): ?>
  <div id="messages"><div class="section clearfix">
      <?php print $messages; ?>
    </div></div> <!-- /.section, /#messages -->
<?php endif; ?>

<?php if (!empty($tabs)): ?>
  <?php print render($tabs); ?>
<?php endif; ?>

<?php if (!empty($action_links)): ?>
  <ul class="action-links"><?php print render($action_links); ?></ul>
<?php endif; ?>

<!-- Main content -->
<main id="int-content">
  <?php if (!empty($page['content'])): ?>
  <?php print render($page['content']); ?>
  <?php endif; ?>
</main>
<!-- /Main content -->

<!-- Site footer -->
<footer role="contentinfo">
  <div class="int-container">
    <header>
      <div class="crest"><img src="http://ou.jywng.co/styleguide/assets/img/ou-crest.png" alt="The Open University Crest"></div>
      <section class="contact">
        <h3>The Open University</h3>
        <div class="tel"><span class="circle"><i class="int-icon int-icon-phone"></i></span> +44 (0) 845 300 60 90</div>
        <div class="email"><span class="circle"><i class="int-icon int-icon-envelope"></i></span> <a href="mailto:info@openuniversity.co.uk">info@openuniversity.co.uk</a></div>
      </section>
    </header>
    <?php if (!empty($page['footer'])): ?>
      <?php print render($page['footer']); ?>
    <?php endif; ?>
    <div class="small-print">
      <p><small>The Open University is incorporated by Royal Charter (RC 000391), an exempt charity in England &amp; Wales and a charity registered in Scotland (SC 038302).</small></p>
      <p class="copyright"><small>© 2014. All rights reserved</small></p>
    </div>
  </div>
</footer>
<!-- /Site footer -->
