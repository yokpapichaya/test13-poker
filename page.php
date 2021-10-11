<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * To generate specific templates for your pages you can use:
 * /mytheme/templates/page-mypage.twig
 * (which will still route through this PHP file)
 * OR
 * /mytheme/page-mypage.php
 * (in which case you'll want to duplicate this file and save to the above path)
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

$context = Timber::context();

$timber_post     = new Timber\Post();
$context['page'] = $timber_post;

if( is_front_page()) {
    $context['body_class'] = 'home';
    $post_list = array(
        'posts_per_page' => 3,
        'post_type' => 'article',
        'orderby'    => 'menu_order',
        'sort_order' => 'desc',
    );
    $context['blog_post'] = Timber::get_posts($post_list);
    $context['options_h_process'] = get_fields('options')['h_process'];
    $context['options_h_sport'] = get_fields('options')['h_sport'];
    $context['options_keno_block'] = get_fields('options')['keno_block'];
    $context['options_trading_block'] = get_fields('options')['trading_block'];
    $context['options_h_link'] = get_fields('options')['h_link'];
    $context['options_all_bacarrat'] = get_fields('options')['all_bacarrat'];
    $context['options_all_slot'] = get_fields('options')['all_slot'];
    Timber::render('templates/page-home.twig', $context);
}else {
    Timber::render( array( 'page-' . $timber_post->post_name . '.twig', 'page.twig' ), $context );
}

