<?php
/* Template Name: article */
$context = Timber::context();

$timber_post     = new Timber\Post();
$context['page'] = $timber_post;
$post_list = array(
    'posts_per_page' => -1,
    'post_type' => 'article',
    'orderby'    => 'menu_order',
    'sort_order' => 'desc',
);
$context['blog_post'] = Timber::get_posts($post_list);
Timber::render('templates/page-article.twig', $context);

