<?php

/***************************************************************
 * Extension Manager/Repository config file for ext "df_contentslide".
 *
 * Auto generated 27-05-2013 22:59
 *
 * Manual updates:
 * Only the data in the array - everything else is removed by next
 * writing. "version" and "dependencies" must not be touched!
 ***************************************************************/

$EM_CONF[$_EXTKEY] = array(
	'title' => 'Dynamic Sliding of Content Elements with AJAX',
	'description' => 'Collapsing and expanding of content elements (http://mootools.net/demos/?demo=Fx.Slide) with dynamic or static loading.',
	'category' => 'fe',
	'shy' => 0,
	'version' => '3.1.0',
	'dependencies' => '',
	'conflicts' => '',
	'priority' => '',
	'loadOrder' => '',
	'module' => '',
	'state' => 'stable',
	'uploadfolder' => 0,
	'createDirs' => '',
	'modify_tables' => 'tt_content',
	'clearcacheonload' => 1,
	'lockType' => '',
	'author' => 'Stefan Galinski',
	'author_email' => 'stefan.galinski@gmail.com',
	'author_company' => '',
	'CGLcompliance' => '',
	'CGLcompliance_note' => '',
	'constraints' => array(
		'depends' => array(
			'php' => '5.2.0-5.4.99',
			'typo3' => '4.5.0-6.1.99',
		),
		'conflicts' => array(
		),
		'suggests' => array(
		),
	),
	'_md5_values_when_last_written' => 'a:15:{s:21:"class.loadcontent.php";s:4:"295c";s:19:"de.locallang_db.xml";s:4:"c733";s:12:"ext_icon.gif";s:4:"3b38";s:17:"ext_localconf.php";s:4:"dc7b";s:14:"ext_tables.php";s:4:"7a18";s:14:"ext_tables.sql";s:4:"2ac8";s:16:"locallang_db.xml";s:4:"0557";s:27:"configuration/constants.txt";s:4:"55c4";s:23:"configuration/setup.txt";s:4:"6c39";s:39:"configuration/bodyTagCssClass/setup.txt";s:4:"501c";s:14:"doc/manual.sxw";s:4:"247b";s:33:"resources/css/df_contentslide.css";s:4:"a171";s:32:"resources/images/ajax-loader.gif";s:4:"5335";s:25:"resources/images/icon.png";s:4:"5d0d";s:39:"resources/javascript/df_contentslide.js";s:4:"4663";}',
	'suggests' => array(
	),
);

?>