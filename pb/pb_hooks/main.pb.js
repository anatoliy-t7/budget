// @ts-nocheck

// Get overview
routerAdd(
	'GET',
	'/api/overview',
	(c) => {
		const ledgerId = c.queryParam('ledgerId');
		const startOf = c.queryParam('startOf');
		const endOf = c.queryParam('endOf');

		const ledger = $app.dao().findRecordById('ledgers', ledgerId);

		const data = {};

		let transactions = $app
			.dao()
			.findRecordsByFilter(
				'transactions',
				`ledger = "${ledgerId}" && created >= "${startOf}" && created <= "${endOf}"`,
			);

		$app.dao().expandRecords(transactions, ['account'], null);

		transactions = JSON.parse(JSON.stringify(transactions));

		transactions?.forEach((record) => {
			const accountId = record.expand.account.id;

			if (!data[accountId]) {
				data[accountId] = {
					income: 0,
					expenses: 0,
					currency: record.expand.account.currency.toLowerCase(),
					balance: 0,
					account: record.expand.account.name,
				};
			}

			if (record.type === 'income') {
				data[accountId].income += record.amount;
				data[accountId].balance += record.amount;
			}

			if (record.type === 'expenses') {
				data[accountId].expenses += record.amount;
				data[accountId].balance -= record.amount;
			}

			if (record.type == 'opened') {
				data[accountId].balance += record.amount;
			}
		});

		const defaultCurrency = ledger.getString('defaultCurrency');

		return c.json(200, { data, defaultCurrency: defaultCurrency.toLowerCase() });
	},
	$apis.requireRecordAuth('users'),
);

// check if is month closed
routerAdd(
	'GET',
	'/api/close-month',
	(c) => {
		const ledgerId = c.queryParam('ledgerId');
		const startOf = c.queryParam('startOf');
		const endOf = c.queryParam('endOf');

		let accounts = $app.dao().findRecordsByFilter('accounts', `ledger = "${ledgerId}"`);

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
				ledger: account.ledger,
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

// Get range tags
routerAdd(
	'GET',
	'/api/tags/range',
	(c) => {
		const utils = require(`${__hooks}/utils.js`);

		const ledgerId = c.queryParam('ledgerId');
		const startOf = c.queryParam('startOf');
		const endOf = c.queryParam('endOf');

		let transactions = $app
			.dao()
			.findRecordsByFilter(
				'transactions',
				`ledger = "${ledgerId}" && created >= "${startOf}" && created <= "${endOf}"`,
			);

		transactions = JSON.parse(JSON.stringify(transactions));

		let tags = utils.getUniqueTags(transactions);
		tags = utils.getUniqueValuesFromArray(tags);

		return c.json(200, tags);
	},
	$apis.requireRecordAuth('users'),
);

// Get range categories
routerAdd(
	'GET',
	'/api/categories/range',
	(c) => {
		const utils = require(`${__hooks}/utils.js`);

		const ledgerId = c.queryParam('ledgerId');
		const startOf = c.queryParam('startOf');
		const endOf = c.queryParam('endOf');

		let transactions = $app
			.dao()
			.findRecordsByFilter(
				'transactions',
				`ledger = "${ledgerId}" && created >= "${startOf}" && created <= "${endOf}"`,
			);

		$app.dao().expandRecords(transactions, ['category'], null);

		transactions = JSON.parse(JSON.stringify(transactions));

		let categories = utils.getUniqueCategories(transactions);
		categories = utils.getUniqueValuesFromArrayOfObject(categories);

		let data = [];
		categories.forEach((c) => {
			const filteredTransactions = transactions.filter((t) => t.category === c.id);

			if (filteredTransactions) {
				const amount = filteredTransactions
					.map((obj) => obj.amount)
					.reduce((accumulator, current) => accumulator + current, 0);

				data.push({ amount, category: c });
			}
		});

		return c.json(200, data);
	},
	$apis.requireRecordAuth('users'),
);

// Get all tags
routerAdd(
	'GET',
	'/api/tags',
	(c) => {
		const utils = require(`${__hooks}/utils.js`);
		const ledgerId = c.queryParam('ledgerId');

		let transactions = $app.dao().findRecordsByFilter('transactions', `ledger = "${ledgerId}"`);

		transactions = JSON.parse(JSON.stringify(transactions));

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

		return c.json(200, utils.getUniqueValuesFromArray(tagsArray));
	},
	$apis.requireRecordAuth('users'),
);

// Update balance on next month
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

// Update balance on next month
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

// Update 'created'
onRecordBeforeCreateRequest((e) => {
	const info = $apis.requestInfo(e.httpContext);

	e.record.set('created', info.data.created);
}, 'transactions');

// Update 'created'
onRecordBeforeUpdateRequest((e) => {
	const info = $apis.requestInfo(e.httpContext);

	e.record.set('created', info.data.created);
}, 'transactions');

// Create first ledger if doesn't exist
onRecordAuthRequest((e) => {
	if (!e.record.getString('ledger')) {
		const collection = $app.dao().findCollectionByNameOrId('ledgers');

		const newBudget = new Record(collection, {
			defaultCurrency: 'USD',
			name: 'Default',
			settings: {
				financeYearStartFrom: 0,
			},
			stripe: {
				userId: e.record.id,
				subscriptionId: '',
				customerId: '',
				productId: '',
				currentPeriodEnd: '',
				trial_end: '',
				unlimited: 0,
			},
		});
		$app.dao().saveRecord(newBudget);

		e.record.set('ledger', newBudget.id);
		$app.dao().saveRecord(e.record);
	}

	$app.dao().expandRecord(e.record, ['ledger'], null);
}, 'users');

onRecordAfterUpdateRequest((e) => {
	$app.dao().expandRecord(e.record, ['ledger'], null);
}, 'users');
