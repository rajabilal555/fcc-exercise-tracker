//! Helper Functions...

let helpers = {
	/**
	 *
	 * @param {Date} date - Date object
	 * @param {String} format
	 * @returns {String}
	 */
	formatDate: function (date, format) {
		const map = {
			mm: date.getMonth() + 1,
			dd: date.getDate(),
			// yy: date.getFullYear().toString().slice(-2),
			yyy: date.getFullYear(),
		};

		return format.replace(/mm|dd|yyy/gi, (matched) => map[matched]);
	},
};

module.exports = helpers;
