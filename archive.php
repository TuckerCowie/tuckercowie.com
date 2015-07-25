<?php
/**
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

<div id="content-wrapper">
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