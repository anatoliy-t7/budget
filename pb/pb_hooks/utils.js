module.exports = {
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
	getUniqueValuesFromArray: (array) =>
		array.filter((currentValue, index, arr) => arr.indexOf(currentValue) === index),
};
