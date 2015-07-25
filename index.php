<?php
/**
 * Template Name: Home
 *
 * Description: A page template that provides a key component of WordPress as a CMS
 * by meeting the need for a carefully crafted introductory page. The front page template
 * in Twenty Twelve consists of a page content area for adding text, images, video --
 * anything you'd like -- followed by front-page-only widgets in one or two columns.
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */

get_header(); ?>

<div id="promo-wrapper">
	<section id="promo">
		<div class="container">
			<div id="cycles">
				<?php if(get_field('promo_items', 246)): ?>
				<?php while(the_repeater_field('promo_items', 246)): ?>
					<div class="cycle"><a href="<?php the_sub_field('page_link'); ?>"><img src="<?php the_sub_field('image'); ?>" alt="Click to view more of <?php the_sub_field('name'); ?>" height="350px" width="960px" /></a></div>
				<?php endwhile; ?>
				<?php endif; ?>
			</div>
			<div class="conversion-area"><a href="<?php the_field('promo-conversion-page', 246); ?>"><?php the_field('promo-conversion-button-name', 246); ?></a>
				<div id="pager"></div>
			</div>
		</div><!-- /container -->
	</section><!-- /promo -->
</div><!-- /promo-wrapper -->

<div id="content-wrapper">
	<section id="content">
		<div class="container">
			<div class="col wide">
				<h1><?php bloginfo('name'); ?><a href="<?php the_field('conversion-page', 246); ?><?php the_field('conversion-variable'); ?>" class="conversion"><?php the_field('conversion-button-name', 246); ?></a></h1>
				<h2><?php the_field('bio', 246); ?></h2>
			</div>
		</div>
	</section>
</div>

<?php if( 1 == 0 ) : ?>
<div id="portfolio-wrapper">
	<section id="portfolio">
		<div class="container">

			<?php if ( have_posts() ) : while ( have_posts() ) : the_post();
					$thumb = wp_get_attachment_image_src( get_post_thumbnail_id($post->ID), 'medium' );
					$url = $thumb['0']; ?>
	
			<div class="col third">
				<div class="preview">
					<a href="<?php the_permalink() ?>" title="<?php the_title(); ?>"><img src="<?=$url?>" alt="<?php the_title(); ?>" /></a>
				</div>
				<div class="description">
					<h3><a href="<?php the_permalink() ?>" title="View more of <?php the_title_attribute(); ?>"><?php the_title(); ?></a></h3>
				</div>
			</div>
			
			<?php endwhile; ?>
			<?php endif; ?>
			
		</div><!-- /container -->
	</section><!-- /portfolio -->
</div><!-- /portfolio-wrapper -->
<?php endif; ?>