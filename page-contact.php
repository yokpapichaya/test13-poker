<?php
/* Template Name: Contact */
$context = Timber::context();

$timber_post     = new Timber\Post();
$context['page'] = $timber_post;
$context['options_c_image'] = get_fields('options')['c_image'];
$context['options_c_content'] = get_fields('options')['c_content'];
$context['options_c_group'] = get_fields('options')['c_group'];
$context['options_c_title'] = get_fields('options')['c_title'];
Timber::render('templates/page-contact.twig', $context);

