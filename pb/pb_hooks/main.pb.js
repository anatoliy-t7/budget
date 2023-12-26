// @ts-nocheck

onRecordBeforeCreateRequest((e) => {
	const info = $apis.requestInfo(e.httpContext);

	e.record.set('created', info.data.created);
}, 'transactions');

// Get income
routerAdd(
	'GET',
	'/api/overview',
	(c) => {
		const budgetId = c.queryParam('budgetId');
		const startOf = c.queryParam('startOf');
		const endOf = c.queryParam('endOf');

		const budget = $app.dao().findRecordById('budgets', budgetId);

		const data = {
			income: 0,
			expenses: 0,
			currency: budget.getString('defaultCurrency'),
			balance: 0,
		};

		let transactions = $app
			.dao()
			.findRecordsByFilter(
				'transactions',
				`budget = "${budgetId}" && created >= "${startOf}" && created <= "${endOf}"`,
			);

		$app.dao().expandRecords(transactions, ['account'], null);

		transactions = JSON.parse(JSON.stringify(transactions));

		transactions?.forEach((record) => {
			if (record.expand.account.currency === budget.getString('defaultCurrency')) {
				if (record.type === 'income') {
					data.income = data.income + record.amount;
				}

				if (record.type === 'expenses') {
					data.expenses = data.expenses + record.amount;
				}

				if (record.type == 'cd') {
					data.balance = data.balance + record.amount;
				}
			}
		});

		data.balance = data.balance + data.income - data.expenses;

		return c.json(200, data);
	},
	$apis.requireRecordAuth('users'),
);

cronAdd('checkCDs', '0 0 1 * *', () => {
	const today = new Date();
	const startOf = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0).toISOString();
	const endOf = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59).toISOString();

	let accounts = $app.dao().findRecordsByExpr('accounts');
	accounts = JSON.parse(JSON.stringify(accounts));

	const prewMonthStart = new Date(startOf).setMonth(new Date(startOf).getMonth() - 1);
	const prewMonthEnd = new Date(endOf).setMonth(new Date(endOf).getMonth() - 1);
	const createdDate = new Date(startOf).setDate(2);

	accounts.forEach((account) => {
		let transactions = $app
			.dao()
			.findRecordsByFilter(
				'transactions',
				`account = "${account.id}" && created >= "${startOf}" && created <= "${endOf}"`,
			);
		transactions = JSON.parse(JSON.stringify(transactions));

		const cd = transactions?.find((t) => t.type === 'cd');

		if (!cd) {
			let prewMonthTransactions = $app
				.dao()
				.findRecordsByFilter(
					'transactions',
					`account = "${account.id}" && created >= "${new Date(
						prewMonthStart,
					).toISOString()}" && created <= "${new Date(prewMonthEnd).toISOString()}"`,
				);
			prewMonthTransactions = JSON.parse(JSON.stringify(prewMonthTransactions));

			const accountData = {
				income: 0,
				expenses: 0,
				balance: 0,
			};

			prewMonthTransactions?.forEach((record) => {
				if (record.type === 'income') {
					accountData.income = accountData.income + record.amount;
				}
				if (record.type === 'expenses') {
					accountData.expenses = accountData.expenses + record.amount;
				}
				if (record.type === 'cd') {
					accountData.balance = accountData.balance + record.amount;
				}
			});

			const total = accountData.balance + accountData.income - accountData.expenses;

			const collection = $app.dao().findCollectionByNameOrId('transactions');
			const newTransaction = new Record(collection, {
				amount: total,
				account: account.id,
				type: 'cd',
				transfer: null,
				category: null,
				budget: account.budget,
				user: null,
				created: new Date(createdDate).toISOString(),
			});
			$app.dao().saveRecord(newTransaction);
		}
	});
});

onRecordAfterDeleteRequest((e) => {
	const oldMonth = isNotCurrentMonth(e.record.created);
	if (oldMonth) {
		updateCdTransaction();
	}

	function updateCdTransaction() {
		let transactions = $app.dao().findRecordsByFilter(
			'transactions',
			`account = "${e.record.getString('account')}" && created >= "${oldMonth}" &&
                created <= "${new Date().toISOString()}" &&
            type = "cd"`,
		);

		transactions.forEach((cd) => {
			if (e.record.getString('type') == 'expenses') {
				cd.set('amount', cd.getInt('amount') + e.record.getInt('amount'));
			}

			if (e.record.getString('type') == 'income') {
				cd.set('amount', cd.getInt('amount') - e.record.getInt('amount'));
			}

			$app.dao().saveRecord(cd);
		});
	}

	function isNotCurrentMonth(dateTime) {
		const dateString = JSON.stringify(dateTime);
		const dateTimeParts = dateString.replace('"', '').split(' ');
		const parts = dateTimeParts[0].split('-');

		var month = parts[1];
		var year = parts[0];
		var currentdate = new Date();
		var cur_month = currentdate.getMonth() + 1;
		var cur_year = currentdate.getFullYear();

		if (cur_month == month && year == cur_year) {
			return false;
		} else {
			const extra = dateString.replace('"', '').split('.');
			const jsDate = new Date(extra[0]);
			const nextMonth = jsDate.setMonth(jsDate.getMonth() + 1);
			const nextMonthWithFirstDay = new Date(nextMonth).setDate(1);

			return new Date(nextMonthWithFirstDay).toISOString();
		}
	}
}, 'transactions');

onRecordAfterCreateRequest((e) => {
	const oldMonth = isNotCurrentMonth(e.record.created);
	if (oldMonth) {
		updateCdTransaction();
	}

	function updateCdTransaction() {
		let transactions = $app.dao().findRecordsByFilter(
			'transactions',
			`account = "${e.record.getString('account')}" && created >= "${oldMonth}" &&
                created <= "${new Date().toISOString()}" &&
            type = "cd"`,
		);

		transactions.forEach((cd) => {
			if (e.record.getString('type') == 'expenses') {
				cd.set('amount', cd.getInt('amount') - e.record.getInt('amount'));
			}

			if (e.record.getString('type') == 'income') {
				cd.set('amount', cd.getInt('amount') + e.record.getInt('amount'));
			}

			$app.dao().saveRecord(cd);
		});
	}

	function isNotCurrentMonth(dateTime) {
		const dateString = JSON.stringify(dateTime);
		const dateTimeParts = dateString.replace('"', '').split(' ');
		const parts = dateTimeParts[0].split('-');

		var month = parts[1];
		var year = parts[0];
		var currentdate = new Date();
		var cur_month = currentdate.getMonth() + 1;
		var cur_year = currentdate.getFullYear();

		if (cur_month == month && year == cur_year) {
			return false;
		} else {
			const extra = dateString.replace('"', '').split('.');
			const jsDate = new Date(extra[0]);
			const nextMonth = jsDate.setMonth(jsDate.getMonth() + 1);
			const nextMonthWithFirstDay = new Date(nextMonth).setDate(1);

			return new Date(nextMonthWithFirstDay).toISOString();
		}
	}
}, 'transactions');
