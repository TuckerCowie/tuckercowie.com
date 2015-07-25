<?php
/**
 * Template Name: Portfolio
 *
 * Description: Twenty Twelve loves the no-sidebar look as much as
 * you do. Use this page template to remove the sidebar from any page.
 *
 * Tip: to remove the sidebar from all posts and pages simply remove
 * any active widgets from the Main Sidebar area, and the sidebar will
 * disappear everywhere.
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */

get_header(); ?>

<div id="content-wrapper">
	<section id="content">
		<div class="container">
			<div class="col wide">

				<?php while ( have_posts() ) : the_post(); ?>
                    <?php get_template_part( 'content', 'page' ); ?>
                <?php endwhile; // end of the loop. ?>
                
            </div><!-- /col wide -->
        </div><!-- /container -->
    </section><!-- /content -->
</div><!-- /content-wrapper -->

<?php get_footer(); ?>