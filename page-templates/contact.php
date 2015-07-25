<?php
/**
 * Template Name: Contact
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
			<div id="contact" class="col wide white shadow padding">
				<h2><?php the_content(); ?></h2>
			</div>
		</div>
	</section>
</div>
<?php get_footer(); ?>