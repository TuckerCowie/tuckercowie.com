<?php
/**
 * The template for displaying 404 pages (Not Found).
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */

get_header(); ?>

	<div id="primary" class="site-content inner">
		<div id="content" role="main">

			<article id="post-0" class="post error404 no-results not-found white shadow padding">
				<header class="entry-header">
					<h1 class="entry-title">404 - Page not found.</h1>
				</header>

				<div class="entry-content">
					<p>Yikes! It seems we can&rsquo;t find what you&rsquo;re looking for. <script>document.write('<a href="' + document.referrer + '">Go back to the previous page</a>');</script>.</p>
				</div><!-- .entry-content -->
			</article><!-- #post-0 -->

		</div><!-- #content -->
	</div><!-- #primary -->

<?php get_footer(); ?>
