<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="main">
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

    <div id="header-wrapper" class="container">
    	<div class="col wide center">
        <header id="header" class="white shadow center">
         	<h1><a href="<?php bloginfo('url');?>">Tucker Cowie's Online Portfolio</a></h1>
            <nav id="navigation">
                <?php wp_nav_menu( array( 'theme_location' => 'primary', 'menu' => 'Main' ) ); ?>
            </nav>
        </header> 
        </div>
    </div><!-- /header-wrapper -->
    <a id="return" href="#"></a>
