<?php
/***************************************************************
 *  Copyright notice
 *
 *  (c) 2011-2012 domainfactory GmbH (Stefan Galinski <stefan.galinski@gmail.com)
 *  All rights reserved
 *
 *  This script is part of the TYPO3 project. The TYPO3 project is
 *  free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  The GNU General Public License can be found at
 *  http://www.gnu.org/copyleft/gpl.html.
 *
 *  This script is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  This copyright notice MUST APPEAR in all copies of the script!
 ***************************************************************/

if (!defined('PATH_typo3conf')) {
	die('Could not access this script directly!');
}

require_once(PATH_typo3 . 'contrib/RemoveXSS/RemoveXSS.php');

/**
 * Loads and renders the bodytext from a given record id with all required
 * transformations. Note that the class does not require a valid page and
 * always assumes zero as page id value.
 *
 * @author Stefan Galinski <stefan.galinski@gmail.com>
 * @package df_contentslide
 */
class dfcontentslide_loadContent {
	/**
	 * @var string
	 */
	protected $content = '';

	/**
	 * Controlling method
	 *
	 * @return void
	 */
	public function main() {
		tslib_eidtools::connectDB();
		$this->initTSFE();

		$parameters = t3lib_div::_GP('df_contentslide');
		$content = $this->getTextByRecordId($parameters['id']);
		$this->content = $this->transformContentByRteConfiguration($content);

		if (t3lib_extMgm::isLoaded('content_replacer')) {
			$extensionPath = t3lib_extMgm::extPath('content_replacer');
			require_once($extensionPath . 'Classes/Controller/class.tx_contentreplacer_controller_main.php');

			/** @var $contentReplacer tx_contentreplacer_controller_Main */
			$contentReplacer = t3lib_div::makeInstance('tx_contentreplacer_controller_Main');
			$this->content = $contentReplacer->main($this->content);
		}
	}

	/**
	 * Prints the content
	 *
	 * @return void
	 */
	public function printContent() {
		header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');
		header('Cache-Control: no-store, no-cache, must-revalidate');
		header('Cache-Control: post-check=0, pre-check=0', FALSE);
		header('Pragma: no-cache');

		echo '<div class="dfcontentslide-content">
			<div class="dfcontentslide-contentSub">' . RemoveXSS::process($this->content) . '</div>
		</div>';
	}

	/**
	 * Initializes the TSFE object
	 *
	 * @return void
	 */
	protected function initTSFE() {
		if (!is_object($GLOBALS['TSFE'])) {
			$GLOBALS['TSFE'] = t3lib_div::makeInstance('tslib_fe', $GLOBALS['TYPO3_CONF_VARS'], 0, 0, TRUE);
			$GLOBALS['TSFE']->initFEuser();
			$GLOBALS['TSFE']->fetch_the_id();
			$GLOBALS['TSFE']->getPageAndRootline();
			$GLOBALS['TSFE']->initTemplate();
			$GLOBALS['TSFE']->forceTemplateParsing = 1;
			$GLOBALS['TSFE']->getConfigArray();
			$GLOBALS['TSFE']->includeTCA();
			$GLOBALS['TSFE']->newCObj();
		}
	}

	/**
	 * Returns the bodytext of the record identified by the given uid
	 *
	 * @param int $id
	 * @return string
	 */
	protected function getTextByRecordId($id) {
		$enableFields = $GLOBALS['TSFE']->sys_page->enableFields('tt_content');
		$row = $GLOBALS['TYPO3_DB']->exec_SELECTgetSingleRow(
			'bodytext',
			'tt_content',
			'uid = ' . intval($id) . $enableFields
		);

		return $row['bodytext'];
	}

	/**
	 * Processes the given text with the rte transformations
	 *
	 * @param string $content
	 * @return string
	 */
	protected function transformContentByRteConfiguration($content) {
		//$RTEsetup = $GLOBALS['BE_USER']->getTSConfig('RTE', t3lib_BEfunc::getPagesTSconfig(0));
		$RTEsetup = array();
		$RTEtypeVal = t3lib_BEfunc::getTCAtypeValue('tt_content', 0);
		$thisConfig = t3lib_BEfunc::RTEsetup($RTEsetup['properties'], 'tt_content', 'bodytext', $RTEtypeVal);

		$specConf['rte_transform']['parameters'] = array(
			'flag=rte_enabled',
			'mode=ts_css-ts_links'
		);

		/** @var $parsehtml_proc t3lib_parsehtml_proc */
		$parsehtml_proc = t3lib_div::makeInstance('t3lib_parsehtml_proc');
		return $parsehtml_proc->RTE_transform($content, $specConf, 'rte', $thisConfig);
	}
}

/** @var $object dfcontentslide_loadContent */
$object = t3lib_div::makeInstance('dfcontentslide_loadContent');
$object->main();
$object->printContent();

?>