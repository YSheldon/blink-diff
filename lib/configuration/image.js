// Copyright 2015 Yahoo! Inc.
// Copyrights licensed under the Mit License. See the accompanying LICENSE file for terms.

var Base = require('./base');
var PNGImage = require('pngjs-image');

var Rect = require('./atoms/rect');

/**
 * @class Image
 * @extends Base
 * @module Configuration
 *
 * @property {PNGImage} _image
 * @property {Rect} _crop
 *
 * @property {boolean} _alreadyCropped
 * @property {PNGImage} _croppedImage
 */
var Image = Base.extend(

	/**
	 * Image constructor
	 *
	 * @param {object} options
	 * @param {string|PNGImage} options.image Image
	 * @param {object|Rect} [options.crop] Cropping of the image
	 * @constructor
	 */
	function (options) {
		this.__super();

		this.setImage(options.image);

		this.setCropRect(options.crop);
	},

	{
		/**
		 * Gets the image
		 *
		 * @method getImage
		 * @return {PNGImage}
		 */
		getImage: function () {
			return this._image;
		},

		/**
		 * Sets the image
		 *
		 * @method setImage
		 * @param {string|PNGImage} image
		 */
		setImage: function (image) {

			if (typeof image == 'string') {
				image = PNGImage.readImageSync(image);
			}

			if (image instanceof PNGImage) {
				this._image = image;
				this._alreadyCropped = false;
				this._croppedImage = null;
			} else {
				throw new Error('Unknown image format.');
			}
		},


		/**
		 * Is image cropped?
		 *
		 * @method isCropped
		 * @return {boolean}
		 */
		isCropped: function () {
			return !!this._crop;
		},

		/**
		 * Gets the cropping rectangle
		 *
		 * @method getCropRect
		 * @return {Rect}
		 */
		getCropRect: function () {
			return this._crop;
		},

		/**
		 * Sets the cropping rectangle
		 *
		 * @method setCropRect
		 * @param {object|Rect} value
		 */
		setCropRect: function (value) {
			this._crop = this._parseObject(value, Rect, 'rect');
			this._alreadyCropped = false;
			this._croppedImage = null;
		},


		/**
		 * Gets the cropped image
		 *
		 * @method getCroppedImage
		 * @return {PNGImage}
		 */
		getCroppedImage: function () {

			var rect;

			if (!this._alreadyCropped) {
				rect = this.getCropRect().getCoordinates();

				this._croppedImage = PNGImage.copyImage(this.getImage());
				this._croppedImage.clip(rect.x, rect.y, rect.width, rect.height);

				this._alreadyCropped = true;
			}

			return this._croppedImage;
		}
	},

	{
		/**
		 * @property TYPE
		 * @type {string}
		 * @static
		 */
		TYPE: 'CONFIGURATION_IMAGE'
	}
);