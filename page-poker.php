<?php
/* Template Name: Poker */
$context = Timber::context();

$timber_post     = new Timber\Post();
$context['page'] = $timber_post;
if(!$_GET['game'] || !$_GET['text']) {
    wp_redirect('home');
}else {
    $context['body_class'] = 'poker';
    $context['page_slug'] = 'poker';

    $context['game_name'] = $_GET['text'];
    $context['game_type'] = $_GET['game'];

    Timber::render('templates/page-poker.twig', $context);
}

