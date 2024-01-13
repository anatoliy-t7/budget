// @ts-nocheck

module.exports = {
	stripe: () => {
		const init = require('stripe')(process.env.SECRET_STRIPE_KEY);
		return init;
	},
	isNotCurrentMonth: (/** @type {string} */ dateTime) => {
		const dateString = JSON.stringify(dateTime);
		const dateTimeParts = dateString.replace('"', '').split(' ');
		const parts = dateTimeParts[0].split('-');

		var month = parts[1];
		var year = parts[0];
		var currentDate = new Date();
		var cur_month = currentDate.getMonth() + 1;
		var cur_year = currentDate.getFullYear();

		if (Number(cur_month) == Number(month) && Number(year) == Number(cur_year)) {
			return null;
		} else {
			const extra = dateString.replace('"', '').split('.');
			const jsDate = new Date(extra[0]);
			const nextMonth = jsDate.setMonth(jsDate.getMonth() + 1);
			const nextMonthWithFirstDay = new Date(nextMonth).setDate(1);

			return new Date(nextMonthWithFirstDay).toISOString();
		}
	},

	getUniqueTags: (transactions) => {
		let tagsArray = [];

		if (transactions?.length) {
			transactions?.forEach((t) => {
				if (t.tags) {
					const tagsTmp = t.tags.split(',');
					tagsTmp?.forEach((tag) => {
						if (tag) {
							tagsArray.push(tag);
						}
					});
				}
			});
		}

		return tagsArray;
	},

	getUniqueCategories: (transactions) => {
		let categoriesArray = [];

		if (transactions?.length) {
			transactions?.forEach((t) => {
				if (t?.expand?.category) {
					categoriesArray.push(t?.expand?.category);
				}
			});
		}

		return categoriesArray;
	},

	getUniqueValuesFromArrayOfObject: (array) => {
		var resArr = [];
		array.filter(function (item) {
			var i = resArr.findIndex((x) => x.id == item.id);
			if (i <= -1) {
				resArr.push(item);
			}
			return null;
		});
		return resArr;
	},

	getUniqueValuesFromArray: (array) => {
		return array?.filter((currentValue, index, arr) => arr.indexOf(currentValue) === index);
	},
};
