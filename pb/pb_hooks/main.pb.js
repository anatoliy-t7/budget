// @ts-nocheck

// Get overview
routerAdd(
	'GET',
	'/api/overview',
	(c) => {
		const budgetId = c.queryParam('budgetId');
		const startOf = c.queryParam('startOf');
		const endOf = c.queryParam('endOf');

		const budget = $app.dao().findRecordById('budgets', budgetId);

		const data = {};

		let transactions = $app
			.dao()
			.findRecordsByFilter(
				'transactions',
				`budget = "${budgetId}" && created >= "${startOf}" && created <= "${endOf}"`,
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

		const defaultCurrency = budget.getString('defaultCurrency');

		return c.json(200, { data, defaultCurrency: defaultCurrency.toLowerCase() });
	},
	$apis.requireRecordAuth('users'),
);

// check if is month closed
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

// Get range tags
routerAdd(
	'GET',
	'/api/tags/range',
	(c) => {
		const utils = require(`${__hooks}/utils.js`);

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

		const budgetId = c.queryParam('budgetId');
		const startOf = c.queryParam('startOf');
		const endOf = c.queryParam('endOf');

		let transactions = $app
			.dao()
			.findRecordsByFilter(
				'transactions',
				`budget = "${budgetId}" && created >= "${startOf}" && created <= "${endOf}"`,
			);

		$app.dao().expandRecords(transactions, ['category'], null);

		transactions = JSON.parse(JSON.stringify(transactions));

		let categories = utils.getUniqueCategories(transactions);
		categories = utils.getUniqueValuesFromArrayOfObject(categories);

		let data = [];
		categories.forEach((c) => {
			const filtredTransactions = transactions.filter((t) => t.category === c.id);

			if (filtredTransactions) {
				const amount = filtredTransactions
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
		const budgetId = c.queryParam('budgetId');

		let transactions = $app.dao().findRecordsByFilter('transactions', `budget = "${budgetId}"`);

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

// stripe webhooks
// routerAdd('POST', '/api/webhooks/stripe', (c) => {
// 	//const utils = require(`${__hooks}/utils.js`);
// 	const stripe = require('../../node_modules/stripe')(process.env.SECRET_STRIPE_KEY);

// 	// extract body
// 	const body = $apis.requestInfo(c).data;

// 	// get the signature from the header
// 	const signature = c.request().header.get('stripe-signature');

// 	// var to hold event data
// 	let event;

// 	// verify it
// 	try {
// 		console.log(stripe);
// 		event = stripe.webhooks.constructEvent(body, signature, process.env.SECRET_STRIPE_WEBHOOK_KEY);
// 	} catch (err) {
// 		// signature is invalid!
// 		console.warn('⚠️  Webhook signature verification failed.', err.message);

// 		// return, because it's a bad request
// 		return c.json(400, { error: `Webhook Error: ${err.message}` });
// 	}

// 	// Extract the object from the event.
// 	const dataObject = event.data.object;

// 	if (dataObject['billing_reason'] == 'subscription_create') {
// 		const subscription_id = dataObject['subscription'];
// 		const payment_intent_id = dataObject['payment_intent'];

// 		// Retrieve the payment intent used to pay the subscription
// 		const payment_intent = stripe.paymentIntents.retrieve(payment_intent_id);

// 		stripe.subscriptions.update(subscription_id, {
// 			default_payment_method: payment_intent.payment_method,
// 		});

// 		stripe.customers.update(payment_intent.customer, {
// 			invoice_settings: {
// 				default_payment_method: payment_intent.payment_method,
// 			},
// 		});
// 	}

// 	/* Signature has been verified, so we can process events
// 	 *
// 	 * Review important events for Billing webhooks:
// 	 * https://stripe.com/docs/billing/webhooks
// 	 */
// 	// Handle the event
// 	switch (event.type) {
// 		case 'invoice.paid':
// 			/*
//               Used to provision services after the trial has ended.
//               The status of the invoice will show up as paid.
//               Store the status in your database to reference
//               when a user accesses your service to avoid hitting
//               rate limits.
//             */
// 			console.log(`Invoice.paid: ${dataObject.status}`);
// 			break;
// 		case 'invoice.payment_succeeded':
// 			/*
//               Insert payment succeeded into the database
//               Allowed access to your service.
//             */
// 			console.log(`payment_succeeded: ${dataObject.status}`);
// 			break;
// 		case 'invoice.payment_failed':
// 			/*
//               If the payment fails or the customer does not have a
//               valid payment method, an invoice.payment_failed event is sent,
//               the subscription becomes past_due.
//               Use this webhook to notify your user that their payment has
//               failed and to retrieve new card details.
//             */
// 			console.log(`invoice.payment_failed: ${dataObject.status}`);
// 			break;
// 		case 'customer.subscription.created':
// 			// Insert active into database and grant access to service
// 			console.log(`customer.subscription.created: ${dataObject.status}`);
// 			break;
// 		case 'customer.subscription.updated':
// 			// Insert active into database and grant access to service
// 			console.log(`customer.subscription.updated: ${dataObject.status}`);
// 			break;
// 		case 'customer.subscription.deleted':
// 			if (event.request != null) {
// 				/*
//                 handle a subscription cancelled by request
//                 from above.
//               */
// 				console.log(`customer.subscription.deleted: ${dataObject.status}`);
// 			} else {
// 				/*
//                 handle subscription cancelled automatically based
//                 upon subscription settings.
//               */
// 				console.log(`customer.subscription.deleted: ${dataObject.status}`);
// 			}
// 			break;
// 		default:
// 			console.log(`Unhandled event type ${event.type}`);
// 	}

// 	// return a 200 with an empty JSON response
// 	return c.json(200, {});
// });

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

// Create first budget if doesn't exist
onRecordAuthRequest((e) => {
	if (!e.record.getString('currentBudget')) {
		const collection = $app.dao().findCollectionByNameOrId('budgets');

		const newBudget = new Record(collection, {
			defaultCurrency: 'USD',
			name: 'Default',
		});

		$app.dao().saveRecord(newBudget);

		e.record.set('currentBudget', newBudget.id);
		e.record.set('budgets', [newBudget.id]);

		$app.dao().saveRecord(e.record);
	}
}, 'users');
