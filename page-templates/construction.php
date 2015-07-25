<?php
/**
 * Template Name: Construction
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

 ?>
 
<!DOCTYPE html>
<!--[if IE 7]>
<html class="ie ie7" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 8]>
<html class="ie ie8" <?php language_attributes(); ?>>
<![endif]-->
<!--[if !(IE 7) | !(IE 8)  ]><!-->
<html <?php language_attributes(); ?>>
<!--<![endif]-->

<head>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<meta description="<?php bloginfo( 'description' ); ?>" />
<meta name="viewport" content="width=device-width" />
<title><?php bloginfo( 'name' ); ?></title>
<link rel="profile" href="http://gmpg.org/xfn/11" />
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
<?php // Loads HTML5 JavaScript file to add support for HTML5 elements in older IE versions. ?>
<!--[if lt IE 9]>
<script src="<?php echo get_template_directory_uri(); ?>/js/html5.js" type="text/javascript"></script>
<![endif]-->
<?php wp_head(); ?>

</head>

<body <?php body_class(); ?>>

<div id="bg-wrapper">

<div id="content-wrapper">
	<section id="content">
		<div class="container">
			<div class="col wide">
                	<p class="construction">Under Construction, check back soon!</p>
                <article id="bio">
                    <h2><?php the_field('bio', 246); ?></h2>
                    <a href="http://digital-everything.com/" class="conversion">Visit Commercial Site</a>
                </article>
            </div>
		</div>
	</section>
</div>

<?php get_footer(); ?>