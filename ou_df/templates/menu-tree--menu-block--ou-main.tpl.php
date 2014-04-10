<?php
/**
 * @file
 *
 * This template wraps the outer layer of a menu.
 */

?>
<nav role="navigation" id="ou-global-primary-navigation">
  <div class="int-primary">
    <div class="int-toplevel-nav int-nav-level">
      <ul class="int-container">
        <?php print $tree; ?>
      </ul>
    </div>
    <div class="int-secondlevel-nav int-nav-level"></div>
    <div class="int-thirdlevel-nav int-nav-level"></div>
  </div>
</nav>

<!-- For non-responsive sites, DO NOT include the following HTML-->
<div id="int-nav-mobile" class="int-nav-alt-mob">
  <div class="int-nav-mob-overlay"></div>
  <div class="int-nav-alt-primary"></div>
  <a href="#" id="int-nav-toggle" class="int-nav-toggle">
    <i class="int-icon int-icon-bars int-icon-lg"></i>
    <i class="int-icon int-icon-times int-icon-lg"></i>
  </a>
</div>
