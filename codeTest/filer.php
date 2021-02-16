<?php
 
 echo '<div class="vert-brd" ></div>'

if ( class_exists( 'WooCommerce' ) ):
$args = array(
   'taxonomy' => 'product_cat',
   'name' => 'product_cat',
   'value_field' => 'slug',
   'class' => 'something',
   'show_option_all'   => __('Todas las categorias','open-shop'),
);
wp_dropdown_categories( $args );
endif;


?>