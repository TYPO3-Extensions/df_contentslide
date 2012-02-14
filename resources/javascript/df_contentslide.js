document.write(
	'<style type="text/css" media="screen">' + "\n" +
		'.dfcontentslide-content {display: none}' + "\n" +
	'</style>'
);

var SlidingElements = new Class({
	Implements: [Options, Events],

	/**
	 * Available options:
	 *
	 * startItem {int} - no open item by default
	 * duration {int} - defaults to 500
	 * transition {string} - defaults to Fx.Transitions.linear
	 *
	 * Events:
	 *
	 * onCollapse
	 * onExpand
	 *
	 * @var {object}
	 */
	options: {
		startItem: -1,
		duration: 500,
		transition: Fx.Transitions.linear,

		onCollapse: null,
		onExpand: null
	},

	/**
	 * Element Map
	 *
	 * Information's about the toggle and content element as well as the collapsible
	 *
	 * @var {object}
	 */
	elementMap: [],

	/**
	 * Initializes the class properties and options
	 *
	 * @param {Array} toggleElements
	 * @param {Array} contentElements
	 * @param {object} options
	 */
	initialize: function(toggleElements, contentElements, options) {
		options = options || {};
		this.setOptions(options);

		this.mapElements(toggleElements, contentElements);
		this.preventDefaultLinkEvents();
		this.addLocationHashPolling();
		this.toggleElement(this.options.startItem, false);
	},

	/**
	 * Returns the content id of the toggle element
	 *
	 * @param {Element} toggleElement
	 * @return {int}
	 */
	getIdFromLink: function(toggleElement) {
		return toggleElement.getElement('a').get('id').substring(3);
	},

	/**
	 * Maps the toggle and content elements and creates the collapsible instances
	 *
	 * @param {Array} toggleElements
	 * @param {Array} contentElements
	 * @return {void}
	 */
	mapElements: function(toggleElements, contentElements) {
		toggleElements.each(function(toggleElement, index) {
			var mapIndex = this.getIdFromLink(toggleElement);
			mapIndex = (mapIndex ? mapIndex : index);

			this.elementMap[mapIndex] = {};
			this.elementMap[mapIndex].toggleItem = toggleElement;
			this.elementMap[mapIndex].collapsed = true;
			if (contentElements[index]) {
				this.elementMap[mapIndex].contentItem = contentElements[index];
				this.elementMap[mapIndex].collapsible = this.createCollapsible(contentElements[index], toggleElement);
			} else {
				this.elementMap[mapIndex].contentItem = null;
				this.elementMap[mapIndex].collapsible = null;
			}

			this.toggleAnchors(this.elementMap[mapIndex], false);
			toggleElement.addEvent('click', this.toggleElement.bind(this, mapIndex));
		}.bind(this));
	},

	/**
	 * Returns an instance of Fx.Slide for the given element
	 *
	 * @param {Element} element
	 * @return {Fx.Slide}
	 */
	createCollapsible: function(element, toggleItem) {
		var collapsible = new Fx.Slide(element, {
			duration: this.options.duration,
			transition: this.options.transition,
			onComplete: function() {
				toggleItem.store('SlidingElementLock', false);
			}
		}).hide();

		collapsible.wrapper.addClass('slidingElements-contentWrapper');
		element.setStyle('display', 'block');
		return collapsible;
	},

	/**
	 * Removes the default events of the anchor links. This prevents
	 * issues if you select elements with the keyboard.
	 *
	 * @return {void}
	 */
	preventDefaultLinkEvents: function() {
		this.elementMap.each(function(map) {
			map.toggleItem.getElements('a').removeEvents().addEvent('click', function(event) {
				event.preventDefault();
			});
		});
	},

	/**
	 * Toggles the selected content element and fires
	 * an event for collapsing or expanding
	 *
	 * @param {int} index
	 * @param {boolean} animate
	 * @return {void}
	 */
	toggleElement: function(index, animate) {
		var map = this.elementMap[index];
		if (!map || (map.contentItem && map.toggleItem.retrieve('SlidingElementLock'))) {
			return;
		}

		if (!map.contentItem) {
			var spinner = new Element('div', {
				'class': 'dfcontentslide-spinner',
				text: ''
			});
			$(map.toggleItem.parentNode).grab(spinner);

			(new Request.HTML({
				method: 'get',
				url: 'index.php?eID=dfcontentslide',
				onComplete: function(responseTree, responseElements) {
					spinner.dispose();
					$(map.toggleItem.parentNode).grab(responseElements[0]);
					this.elementMap[index].contentItem = responseElements[0];
					this.elementMap[index].collapsible = this.createCollapsible(responseElements[0], map.toggleItem);
					this.toggleElement(index, animate);
				}.bind(this)
			})).send('df_contentslide[id]=' + this.getIdFromLink(map.toggleItem));
			return;

		} else if (animate) {
			map.toggleItem.store('SlidingElementLock', true);
		}

		this.toggleAnchors(map, map.collapsed, true);
		if (map.collapsed && animate) {
			map.collapsible.slideIn();
		} else if (map.collapsed && !animate) {
			map.collapsible.show();
		} else if (animate) {
			map.collapsible.slideOut();
		} else {
			map.collapsible.hide();
		}

		this.fireEvent((map.collapsed ? 'onExpand' : 'onCollapse'), [map, index, this]);
		map.collapsed = !map.collapsed;
	},

	/**
	 * Toggles the visibility of links inside the content elements to
	 * prevent a nasty bug
	 *
	 * @param {object} map
	 * @param {boolean} setVisible
	 * @param {boolean} delayOnHide
	 * @return {void}
	 */
	toggleAnchors: function(map, setVisible, delayOnHide) {
		if (setVisible) {
			map.contentItem.getElements('a').setStyle('display', 'inline');
		} else {
			var hide = function() {
				this.contentItem.getElements('a').setStyle('display', 'none');
			};

			if (delayOnHide) {
				hide.delay(this.options.duration, map);
			} else {
				hide.bind(map);
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
		this.hashHandler.delay(1, this); // prevents a rare and minor bug with cropped content
		this.hashHandler.periodical(1000, this);
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

		var index = null;
		this.locationHash = window.location.hash;
		if (this.locationHash !== '' && this.locationHash.substring(1, 4) === 'acc') {
			index = parseInt(this.locationHash.substring(4));
		}

		if (!isNaN(index)) {
			this.toggleElement(index, true);
		}
	}
});

window.addEvent('domready', function() {
	var toggleClasses = function(map) {
		map.toggleItem.toggleClass('dfcontentslide-active');
		map.contentItem.toggleClass('dfcontentslide-contentActive');
	};

	(new SlidingElements($$('.dfcontentslide-toggle'), $$('.dfcontentslide-content'), {
		duration: 100,
		onExpand: toggleClasses,
		onCollapse: toggleClasses
	}));
});