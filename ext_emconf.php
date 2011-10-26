<?php

########################################################################
# Extension Manager/Repository config file for ext "df_contentslide".
#
# Auto generated 10-02-2011 22:39
#
# Manual updates:
# Only the data in the array - everything else is removed by next
# writing. "version" and "dependencies" must not be touched!
########################################################################

$EM_CONF[$_EXTKEY] = array(
	'title' => 'Dynamic Sliding of Content Elements with AJAX',
	'description' => 'Collapsing and expanding of content elements (http://mootools.net/demos/?demo=Fx.Slide) with dynamic or static loading.',
	'category' => 'fe',
	'shy' => 0,
	'version' => '2.1.0',
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
	'author_email' => 'http://www.df.eu',
	'author_company' => 'domainfactory GmbH',
	'CGLcompliance' => '',
	'CGLcompliance_note' => '',
	'constraints' => array(
		'depends' => array(
			'php' => '5.2.0-5.3.99',
			'typo3' => '4.5.0-4.6.99',
		),
		'conflicts' => array(
		),
		'suggests' => array(
		),
	),
	'_md5_values_when_last_written' => 'a:9:{s:19:"de.locallang_db.xml";s:4:"113c";s:12:"ext_icon.gif";s:4:"3b38";s:14:"ext_tables.php";s:4:"5380";s:14:"ext_tables.sql";s:4:"dbaf";s:16:"locallang_db.xml";s:4:"33cf";s:27:"configuration/constants.txt";s:4:"fc78";s:23:"configuration/setup.txt";s:4:"53e9";s:30:"resources/css/df_contentslide.css";s:4:"48fc";s:36:"resources/javascript/df_contentslide.js";s:4:"abdd";}',
	'suggests' => array(
	),
);

?>