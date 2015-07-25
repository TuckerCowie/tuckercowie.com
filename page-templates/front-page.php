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
	<section id="promo" class="shadow">
		<div class="container shadow">
			<div id="cycles">
				<?php if(get_field('promo_items', 246)): ?>
				<?php while(the_repeater_field('promo_items', 246)): ?>
					<div class="cycle">
                    	<a href="<?php if(get_sub_field('page_link')==true):the_sub_field('page_link');else:the_sub_field('url');endif; ?>"><img src="<?php the_sub_field('image'); ?>" alt="Click to view more of <?php the_sub_field('title'); ?>" height="350px" width="960px" /></a>
                    </div>
				<?php endwhile; ?>
				<?php endif; ?>
			</div>
		</div><!-- /container -->
	</section><!-- /promo -->
</div><!-- /promo-wrapper -->

<div id="content-wrapper">
	<section id="content">
		<div class="container">
			<div id="bio" class="col wide white shadow padding">
				<h2><?php the_field('bio', 246); ?></h2>
			</div>
		</div>
	</section>

    <div id="portfolio">
        <div class="grid">
            <?php 
            query_posts( array ( 'post_type' => 'post', 'posts_per_page' => -1 ) );
            if ( have_posts() ) :
            while ( have_posts() ) : the_post();
            ?>
                <div class="item shadow <?php $category = get_the_category( $id ); echo $category[0]->slug; ?>">
                    <img src="<?php if(get_field('thumbnail', $post_id)): the_field('thumbnail', $post_id); else:?><?php bloginfo('template_directory'); ?>/images/placeholder.jpg<?php endif;?>" alt="<?php the_title();?>" />
                    <div class="overlay opaque padding">
                    	<a class="clear" href="<?php the_permalink();?>"></a>
                        <h3><span><?php the_title();?></span></h3>
                        <p><?php the_date();?></p>
                        <p><?php the_excerpt();?></p>
                        <?php if(1==0):?><a href="#" alt="Share This" class="btn share"></a><?php endif;?><a href="<?php the_permalink();?>" alt="View More" class="btn more"></a>
                    </div>
                </div>
            <?php endwhile; endif; wp_reset_query(); ?>
        </div><!-- /portfolio -->
    </div>
    
</div><!-- /#content-wrapper -->

<?php get_footer(); ?>