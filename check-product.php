<?php

$p_list = get_field('product_check', 'options');

if( is_user_logged_in() ) {
    foreach ($p_list as $key => $value) {
        if($value == 'casino') {
            add_filter('acf/load_field/name=casino_choice', 'acf_load_casino_choice');
        }elseif($value == 'slot') {
            add_filter('acf/load_field/name=slot_choice', 'acf_load_slot_choice');
        }elseif($value == 'keno') {
            add_filter('acf/load_field/name=keno_choice', 'acf_load_keno_choice');
        }
        elseif($value == 'trading') {
            add_filter('acf/load_field/name=trading_choice', 'acf_load_trading_choice');
        }
    }
}

function acf_load_slot_choice( $field ) {

    $p_list = get_field('product_check', 'options');
    // reset choices
    $field['choices'] = array(); 

    $jsonData = file_get_contents('https://cdn.ambbet.com/gamelists-' . get_field('agent_choice', 'options') . '.json');
    $obj = json_decode($jsonData);
    
    $slots = array();
    $slot = array();
    $pokers = array();
    $poker = array();
    $filterSlot = 'slot';
    $filterPoker = 'poker';

    foreach ($obj->lists as $key => $value) {
        if(in_array('amb-poker', $p_list)) {
            if($value->type == $filterSlot || $value->type == $filterPoker) {
                $slot[ $value->productCode ] = $value->productName;
            }
        }else {
            if($value->type == $filterSlot) {
                $slot[ $value->productCode ] = $value->productName;
            }
        }
    }

    if(is_array($slot)) {
        foreach( $slot as $key =>  $choice ) {
            $field['choices'][ $key ] = $choice;
        }
    }
    
    // return the field
    return $field;
}

function acf_load_casino_choice( $field ) {
    
    // reset choices
    $field['choices'] = array();
    $jsonData = file_get_contents('https://cdn.ambbet.com/gamelists-' . get_field('agent_choice', 'options') . '.json');
    $obj = json_decode($jsonData);

    $casinos = array();
    $casino = array();
    $filterCasino = 'casino';

    foreach ($obj->lists as $key => $value) {
        if($value->type == $filterCasino) {
            $casino[ $value->productCode ] = $value->productName;
        }
    }

    foreach ($casinos as $key => $value) {
        $casino[ $value->productCode ] = $value->productName;
    }

    if( is_array($casino) ) {
        foreach( $casino as $key => $choice ) {
            $field['choices'][ $key ] = $choice;
        }
    }
    
    return $field;
}

function acf_load_keno_choice( $field ) {
    
    // reset choices
    $field['choices'] = array();
    $jsonData = file_get_contents('https://cdn.ambbet.com/gamelists-' . get_field('agent_choice', 'options') . '.json');
    $obj = json_decode($jsonData);

    $kenos = array();
    $keno = array();
    $filterKeno = 'keno';

    foreach ($obj->lists as $key => $value) {
        if($value->type == $filterKeno) {
            $keno[ $value->productCode ] = $value->productName;
        }
    }

    foreach ($kenos as $key => $value) {
        $keno[ $value->productCode ] = $value->productName;
    }

    if( is_array($keno) ) {
        foreach( $keno as $key => $choice ) {
            $field['choices'][ $key ] = $choice;
        }
    }
    
    return $field;
}

function acf_load_trading_choice( $field ) {
    
    // reset choices
    $field['choices'] = array();
    $jsonData = file_get_contents('https://cdn.ambbet.com/gamelists-' . get_field('agent_choice', 'options') . '.json');
    $obj = json_decode($jsonData);

    $tradings = array();
    $trading = array();
    $filterTrading = 'trading';

    foreach ($obj->lists as $key => $value) {
        if($value->type == $filterTrading) {
            $trading[ $value->productCode ] = $value->productName;
        }
    }

    foreach ($tradings as $key => $value) {
        $trading[ $value->productCode ] = $value->productName;
    }

    if( is_array($trading) ) {
        foreach( $trading as $key => $choice ) {
            $field['choices'][ $key ] = $choice;
        }
    }
    
    return $field;
}

?>