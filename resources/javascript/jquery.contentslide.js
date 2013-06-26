if (!document.documentElement.className.match(/(^| )hasJs/)) {
	document.documentElement.className = 'hasJs ' + document.documentElement.className;
}

/**
 * Initializes the class properties and options
 *
 * @param {Array} toggleElements
 * @param {Array} contentElements
 * @param {object} options
 */
window.SlidingElements = function(toggleElements, contentElements, options) {
	$.extend(this.options, options || {});

	this.mapElements(toggleElements, contentElements);
	this.preventDefaultLinkEvents();
	this.addLocationHashPolling();
	this.toggleElement(this.options.startItem, false);
};

window.SlidingElements.prototype = {
	/**
	 * Available options:
	 *
	 * startItem {int} - no open item by default
	 * duration {int} - defaults to 500
	 *
	 * @var {object}
	 */
	options: {
		startItem: -1,
		duration: 500
	},

	/**
	 * Element Map
	 *
	 * Information about the toggle and content element
	 *
	 * @var {array}
	 */
	elementMap: [],

	/**
	 * Index of the "mapIndex" values of the elementMap for fast access
	 *
	 * @var {object}
	 */
	mapIndexMap: {},

	/**
	 * Returns the content id of the toggle element
	 *
	 * @param {jQuery} toggleElement
	 * @return {int}
	 */
	getIdFromLink: function(toggleElement) {
		return toggleElement.find('a').attr('id').substring(3);
	},

	/**
	 * Maps the toggle and content elements
	 *
	 * @param {Array} toggleElements
	 * @param {Array} contentElements
	 * @return {void}
	 */
	mapElements: function(toggleElements, contentElements) {
		toggleElements.each(function(index, toggleElement) {
			var mapIndex = this.getIdFromLink($(toggleElement));
			mapIndex = (mapIndex ? mapIndex : index);
			this.mapIndexMap[mapIndex] = index;

			this.elementMap[index] = {};
			this.elementMap[index].mapIndex = mapIndex;
			this.elementMap[index].toggleItem = $(toggleElement);
			this.elementMap[index].collapsed = true;
			this.elementMap[index].contentItem = $(contentElements[index]);
			this.elementMap[index].contentItem.addClass('slidingElements-contentWrapper');

			this.changeVisibilityOfAnchors(this.elementMap[index], false, false);
			this.elementMap[index].toggleItem.click(this.toggleElement.bind(this, mapIndex));
		}.bind(this));
	},

	/**
	 * Removes the default events of the anchor links. This prevents
	 * issues if you select elements with the keyboard.
	 *
	 * @return {void}
	 */
	preventDefaultLinkEvents: function() {
		$.each(this.elementMap, function(index, map) {
			map.toggleItem.find('a').unbind('click').click(function(event) {
				event.preventDefault();
			});
		});
	},

	/**
	 * Loads the element content via AJAX
	 *
	 * @param {object} element
	 * @param {int} index
	 * @param {Function} callback
	 * @return {void}
	 */
	loadElementContent: function(element, index, callback) {
		var spinner = $('<div class="dfcontentslide-spinner" />');
		$(element.toggleItem[0].parentNode).append(spinner);

		$.ajax({
			type: 'get',
			url: 'index.php?eID=dfcontentslide',
			data: 'df_contentslide[id]=' + this.getIdFromLink(element.toggleItem),
			success: function(response) {
				response = $(response);
				spinner.remove();
				if (response.length) {
					$(element.toggleItem[0].parentNode).append(response);
					element.contentItem = response.addClass('slidingElements-contentWrapper');
					callback();
				}
			}.bind(this)
		});
	},

	/**
	 * Toggles the selected content element
	 *
	 * @param {int} index
	 * @param {boolean} animate
	 * @return {void}
	 */
	toggleElement: function(index, animate) {
		var element = this.elementMap[this.mapIndexMap[index]];
		if (!element) {
			return;
		}

		if (element.collapsed) {
			this.expand(index, animate);
		} else {
			this.collapse(index, animate);
		}
	},

	/**
	 * Collapses all sliding elements on this page
	 *
	 * @param {boolean} animate
	 * @return {void}
	 */
	collapseAll: function(animate) {
		$.each(this.elementMap, function(index, map) {
			this.collapse(map.mapIndex, animate);
		}.bind(this));
	},

	/**
	 * Expands all sliding elements on this page
	 *
	 * @param {boolean} animate
	 * @return {void}
	 */
	expandAll: function(animate) {
		$.each(this.elementMap, function(index, map) {
			this.expand(map.mapIndex, animate);
		}.bind(this));
	},

	/**
	 * Collapses a sliding element and fires the onCollapse event afterwards
	 *
	 * @param {int} index
	 * @param {boolean} animate
	 * @return {void}
	 */
	collapse: function(index, animate) {
		var element = this.elementMap[this.mapIndexMap[index]];
		if (!element || element.collapsed) {
			return;
		}

		if (!element.contentItem.length) {
			this.loadElementContent(element, index, this.collapse.bind(this, index, animate));
			return;
		}

		if (element.toggleItem.prop('SlidingElementLock')) {
			return;
		} else if (animate) {
			element.toggleItem.prop('SlidingElementLock', true);
		}

		this.changeVisibilityOfAnchors(element, false, true);

		if (animate) {
			element.contentItem.slideUp(this.options.duration, function() {
				element.toggleItem.prop('SlidingElementLock', false);
			});
		} else {
			element.contentItem.css('display', 'none');
		}

		element.toggleItem.find('a').each(function(index, link) {
			link.blur();
		});

		element.collapsed = true;

		element.toggleItem.toggleClass('dfcontentslide-active');
		element.contentItem.toggleClass('dfcontentslide-contentActive');
	},

	/**
	 * Expands a sliding element and fires the onExpand event afterwards
	 *
	 * @param {int} index
	 * @param {boolean} animate
	 * @return {void}
	 */
	expand: function(index, animate) {
		var element = this.elementMap[this.mapIndexMap[index]];
		if (!element || !element.collapsed) {
			return;
		}

		if (!element.contentItem.length) {
			this.loadElementContent(element, index, this.expand.bind(this, index, animate));
			return;
		}

		if (element.toggleItem.prop('SlidingElementLock')) {
			return;
		} else if (animate) {
			element.toggleItem.prop('SlidingElementLock', true);
		}

		this.changeVisibilityOfAnchors(element, true, true);

		if (animate) {
			element.contentItem.slideDown(this.options.duration, function() {
				element.toggleItem.prop('SlidingElementLock', false);
				element.contentItem.closest().css('height', 'auto');
			});
		} else {
			element.contentItem.css('display', 'block');
			element.contentItem.closest().css('height', 'auto');
		}

		element.collapsed = false;

		element.toggleItem.toggleClass('dfcontentslide-active');
		element.contentItem.toggleClass('dfcontentslide-contentActive');
	},

	/**
	 * Changes the visibility of links inside the content elements to
	 * prevent nasty display issues
	 *
	 * @param {object} map
	 * @param {boolean} setVisible
	 * @param {boolean} delayOnHide
	 * @return {void}
	 */
	changeVisibilityOfAnchors: function(map, setVisible, delayOnHide) {
		if (setVisible) {
			map.contentItem.find('a').css('display', 'inline');
		} else {
			var hide = function() {
				if (map.contentItem) {
					map.contentItem.find('a').css('display', 'none');
				}
			};

			if (delayOnHide) {
				setTimeout(hide.bind(this), this.options.duration);
			} else {
				hide();
			}
		}
	},

	/**
	 * Adds an URL hash evaluation with a polling interval of 1000ms to grant the possibility to
	 * manually open content elements by changing the location hash inside the URL (e.g. acc123).
	 *
	 * @return {void}
	 */
	addLocationHashPolling: function() {
		setTimeout(this.hashHandler.bind(this), 1); // prevents a rare and minor bug with cropped content
		setInterval(this.hashHandler.bind(this), 1000);
	},

	/**
	 * Location Hash Handler
	 *
	 * @return {void}
	 */
	hashHandler: function() {
		if (this.locationHash === window.location.hash) {
			return;
		}

		var index = -1;
		this.locationHash = window.location.hash;
		if (this.locationHash !== '' && this.locationHash.substring(1, 4) === 'acc') {
			index = parseInt(this.locationHash.substring(4), 10);
		}

		if (!isNaN(index)) {
			this.toggleElement(index, true);
		}
	}
};

$(document).ready(function() {
	window.SlidingElements.instance = new window.SlidingElements(
		$('.dfcontentslide-toggle'), $('.dfcontentslide-content'), {
			duration: 100
		}
	);
});