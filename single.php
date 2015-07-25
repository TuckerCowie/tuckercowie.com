<?php
/**
 * The Template for displaying all single posts.
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */

get_header(); ?>

<?php while ( have_posts() ) : the_post();
	$next = get_permalink(get_adjacent_post(false,'',false));
	$prev = get_permalink(get_adjacent_post(false,'',true)); ?>

<div id="content-wrapper" class="inner">

	<article id="content" class="post">
    
        <section class="container">
        
            <div class="col wide white shadow padding">
    				
					<?php if($prev == true): ?><div id="top-nav-single"><a href="<?php echo $prev; ?>" class="previous"></a><?php endif;?>
                    <h1 class="post-title"><?php the_title(); ?></h1>
					<?php if($next != post_permalink( $ID )): ?><a href="<?php echo $next;?>" class="next"></a><?php endif;?></div>
                    
					<?php the_content(); ?>    
                               
					<?php if(get_field('photos', $post_id)):?>
						<?php while(the_repeater_field('photos', $post_id)):?>
                        	<img src="<?php the_sub_field('photo'); ?>" />
                        <?php endwhile; ?>
					<?php endif; ?>
            </div>
            
			<div class="col wide">
                <nav id="bottom-nav-single">
                    <span class="previous"><?php previous_post_link(); ?></span>
                    <span class="next"><?php next_post_link(); ?></span>
                </nav><!-- .nav-single -->
			</div>
                       
        </section><!-- /container -->
    
    </article><!-- /content -->
</div><!-- /content-wrapper -->

<?php endwhile; // end of the loop. ?>

<?php get_footer(); ?>