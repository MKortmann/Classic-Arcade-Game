/* Resources.js
 * This is simply an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */
/**This is a Immediately-Invoked Function Expresson: called immediately after
it is defined. 1 - It is used to create a private scope!
2- normally is intended to be invoked Once*/
(function() {
	var resourceCache = {};
	var readyCallbacks = [];

	/* This is the publicly accessible image loading function. It accepts
	 * an array of strings pointing to image files or a string for a single
	 * image. It will then call our private image loading function accordingly.
	 */
	function load(urlOrArr) {
		if (urlOrArr instanceof Array) {
			/* If the developer passed in an array of images
			 * loop through each value and call our image
			 * loader on that image file
			 */
			urlOrArr.forEach(function(url) {
				_load(url);
			});
		} else {
			/* The developer did not pass an array to this function,
			 * assume the value is a string and call our image loader
			 * directly.
			 */
			_load(urlOrArr);
		}
	}

	/* This is our private image loader function, it is
	 * called by the public image loader function.
	 */
	function _load(url) {
		if (resourceCache[url]) {
			/* If this URL has been previously loaded it will exist within
			 * our resourceCache array. Just return that image rather than
			 * re-loading the image.
			 */
			return resourceCache[url];
		} else {
			/* This URL has not been previously loaded and is not present
			 * within our cache; we'll need to load this image.
			 */
			var img = new Image();
			img.onload = function() {
				/**This event handler will be called on the
				             image element when the image has finished loading. This applies
				             whether the image is applied via the src attribute or the list-style-image
				              style property.*/
				/* Once our image has properly loaded, add it to our cache
				 * so that we can simply return this image if the developer
				 * attempts to load this file in the future.
				 */
				resourceCache[url] = img;

				/* Once the image is actually loaded and properly cached,
				 * call all of the onReady() callbacks we have defined.
				 */
				if (isReady()) {
					/**So, all the images are loaded then call the
					                 readyCallbacks array that stored the init function at the
					                 file: engine.js. It will reset, store lastime and call the
					                 main function*/
					readyCallbacks.forEach(function(func) {
						func();
					});
				}
			};

			/* Set the initial cache value to false, this will change when
			 * the image's onload event handler is called. Finally, point
			 * the image's src attribute to the passed in URL.
			 */
			resourceCache[url] = false;
			img.src = url;
		}
	}

	/* This is used by developers to grab references to images they know
	 * have been previously loaded. If an image is cached, this functions
	 * the same as calling load() on that URL.
	 */
	function get(url) {
		return resourceCache[url];
	}

	/* This function determines if all of the images that have been requested
	 * for loading have in fact been properly loaded.
	 */
	function isReady() {
		var ready = true;
		for (var k in resourceCache) {
			/**hasOwnProperty is a JavaScript Standard method that returns a boolean
			value indicating that the resourcesCache has this Property with the name of
			argument (K)*/
			if (resourceCache.hasOwnProperty(k) &&
				!resourceCache[k]) {
				ready = false;
			}
		}
		return ready;
	}

	/* This function will add a function to the callback stack on the array (readyCallbacks)
	 * that is called when all requested images are properly loaded.
	 */
	function onReady(func) {
		readyCallbacks.push(func);
	}

	/* This object defines the publicly accessible functions available to
	 * developers by creating a global Resources object.
	 */
	window.Resources = {
		load: load,
		get: get,
		onReady: onReady,
		isReady: isReady
	};
})();
