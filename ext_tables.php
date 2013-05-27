<?php

if (!defined('TYPO3_MODE')) {
	die('Access denied.');
}

// add static extension template
t3lib_extMgm::addStaticFile($GLOBALS['_EXTKEY'], 'configuration/', 'Content Slide');
t3lib_extMgm::addStaticFile(
	$GLOBALS['_EXTKEY'], 'configuration/bodyTagCssClass/', 'Content Slide (Body Tag CSS Class)'
);

// add contentslide checkbox to the tt_content TCA form
$tempColumns = array(
	'tx_df_contentslide_contentslide' => array(
		'exclude' => TRUE,
		'label' => 'LLL:EXT:df_contentslide/locallang_db.xml:tt_content.tx_df_contentslide_contentslide',
		'config' => array(
			'type' => 'check',
			'items' => array(
				1 => array(
					'LLL:EXT:df_contentslide/locallang_db.xml:tt_content.tx_df_contentslide_activate'
				),
				2 => array(
					'LLL:EXT:df_contentslide/locallang_db.xml:tt_content.tx_df_contentslide_withAjax'
				),
			),
		),
	)
);

t3lib_div::loadTCA('tt_content');
t3lib_extMgm::addTCAcolumns('tt_content', $tempColumns, 1);
$GLOBALS['TCA']['tt_content']['palettes']['frames']['showitem'] .= ',tx_df_contentslide_contentslide';

?>