// @ts-nocheck

onRecordBeforeCreateRequest((e) => {
	const info = $apis.requestInfo(e.httpContext);

	e.record.set('created', info.data.created);
}, 'transactions');

onRecordBeforeUpdateRequest((e) => {
	const info = $apis.requestInfo(e.httpContext);

	e.record.set('created', info.data.created);
}, 'transactions');

// Get overview
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

				if (record.type == 'opened') {
					data.balance = data.balance + record.amount;
				}
			}
		});

		data.balance = data.balance + data.income - data.expenses;

		return c.json(200, data);
	},
	$apis.requireRecordAuth('users'),
);

routerAdd(
	'GET',
	'/api/close-month',
	(c) => {
		const budgetId = c.queryParam('budgetId');
		const startOf = c.queryParam('startOf');
		const endOf = c.queryParam('endOf');

		let accounts = $app.dao().findRecordsByFilter('accounts', `budget = "${budgetId}"`);

		accounts = JSON.parse(JSON.stringify(accounts));

		let openedMonth = new Date(startOf);
		openedMonth = new Date(openedMonth).setMonth(new Date(openedMonth).getMonth(openedMonth) + 1);
		openedMonth = new Date(openedMonth).setDate(15);
		openedMonth = new Date(openedMonth).toString();

		let closedMonth = new Date(startOf).setDate(15);
		closedMonth = new Date(closedMonth).toString();

		accounts.forEach((account) => {
			let transactions = $app
				.dao()
				.findRecordsByFilter(
					'transactions',
					`account = "${account.id}" && created >= "${startOf}" && created <= "${endOf}"`,
				);

			transactions = JSON.parse(JSON.stringify(transactions));

			const accountData = {
				income: 0,
				expenses: 0,
				balance: 0,
			};

			transactions?.forEach((record) => {
				if (record.type === 'income') {
					accountData.income += record.amount;
				}
				if (record.type === 'expenses') {
					accountData.expenses += record.amount;
				}
				if (record.type === 'opened') {
					accountData.balance += record.amount;
				}
			});

			const total = accountData.balance + accountData.income - accountData.expenses;

			const collection = $app.dao().findCollectionByNameOrId('transactions');

			const transactionObject = {
				amount: total,
				account: account.id,
				type: 'closed',
				transfer: null,
				category: null,
				budget: account.budget,
				user: null,
				created: new Date(closedMonth).toISOString(),
			};

			const closedTransaction = new Record(collection, transactionObject);
			$app.dao().saveRecord(closedTransaction);

			transactionObject.type = 'opened';
			transactionObject.created = new Date(openedMonth).toISOString();

			const openedTransaction = new Record(collection, transactionObject);
			$app.dao().saveRecord(openedTransaction);
		});

		return c.json(200, { success: true });
	},
	$apis.requireRecordAuth('users'),
);

onRecordAfterDeleteRequest((e) => {
	const utils = require(`${__hooks}/utils.js`);

	const oldMonth = utils.isNotCurrentMonth(e.record.created);

	if (oldMonth) {
		updateCdTransaction();
	}

	function updateCdTransaction() {
		let transactions = $app.dao().findRecordsByFilter(
			'transactions',
			`account = "${e.record.getString('account')}" && created >= "${oldMonth}" &&
                created <= "${new Date().toISOString()}" &&
            type = "opened"`,
		);

		transactions.forEach((opened) => {
			if (e.record.getString('type') == 'expenses') {
				opened.set('amount', opened.getInt('amount') + e.record.getInt('amount'));
			}

			if (e.record.getString('type') == 'income') {
				opened.set('amount', opened.getInt('amount') - e.record.getInt('amount'));
			}

			$app.dao().saveRecord(opened);
		});
	}
}, 'transactions');

onRecordAfterCreateRequest((e) => {
	const utils = require(`${__hooks}/utils.js`);

	const oldMonth = utils.isNotCurrentMonth(e.record.created);

	if (oldMonth) {
		updateCdTransaction();
	}

	function updateCdTransaction() {
		let transactions = $app.dao().findRecordsByFilter(
			'transactions',
			`account = "${e.record.getString('account')}" && created >= "${oldMonth}" &&
                created <= "${new Date().toISOString()}" &&
            type = "opened"`,
		);

		transactions.forEach((opened) => {
			if (e.record.getString('type') == 'expenses') {
				opened.set('amount', opened.getInt('amount') - e.record.getInt('amount'));
			}

			if (e.record.getString('type') == 'income') {
				opened.set('amount', opened.getInt('amount') + e.record.getInt('amount'));
			}

			$app.dao().saveRecord(opened);
		});
	}
}, 'transactions');

// Get tags from notes
routerAdd(
	'GET',
	'/api/tags',
	(c) => {
		const budgetId = c.queryParam('budgetId');
		const startOf = c.queryParam('startOf');
		const endOf = c.queryParam('endOf');

		let transactions = $app
			.dao()
			.findRecordsByFilter(
				'transactions',
				`budget = "${budgetId}" && created >= "${startOf}" && created <= "${endOf}"`,
			);

		transactions = JSON.parse(JSON.stringify(transactions));

		let tagsArray = [];

		if (transactions?.length) {
			transactions?.forEach((t) => {
				const tagsTmp = t.note?.match(/#[a-z0-9_]+/g);

				tagsTmp?.forEach((tag) => {
					if (tag) {
						tagsArray.push(tag);
					}
				});
			});
		}

		return c.json(200, tagsArray);
	},
	$apis.requireRecordAuth('users'),
);
