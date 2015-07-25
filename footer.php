<?php
/**
 * The template for displaying the footer.
 *
 * Contains footer content and the closing of the
 * #main and #page div elements.
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */
 
 ?>

<div id="footer-wrapper">
	<footer id="footer">
		<div class="container">
        	<div class="col wide white shadow padding">
		            &copy;Copyright 2013. Designed from scratch by <span class="blue">Tucker Cowie</span> using <a href="http://wordpress.org/">Wordpress</a>.
                    <nav id="social-nav">
                		<?php wp_nav_menu( array( 'theme_location' => 'primary', 'menu' => 'Networking' ) ); ?>
            		</nav>
            </div><!-- /col wide -->
        </div><!-- /container -->
        
        <div class="emboss"></div>

    </footer><!-- /footer -->
</div>

<script type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"></script>
<script type="text/javascript" src="<?php bloginfo('template_directory'); ?>/js/cycles-lite.js"></script>
<script type="text/javascript"src="<?php bloginfo('template_directory'); ?>/js/easing.js"></script>
<script type="text/javascript"src="<?php bloginfo('template_directory'); ?>/js/js.js"></script>

<?php wp_footer(); ?>

</div>
</body>
</html>