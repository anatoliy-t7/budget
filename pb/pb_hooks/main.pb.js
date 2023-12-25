// @ts-nocheck
// Get income
routerAdd("GET", "/api/overview", (c) => {
    const budgetId = c.queryParam("budgetId")
    const startOf = c.queryParam("startOf")
    const endOf = c.queryParam( "endOf" )

    const budget = $app.dao().findRecordById( "budgets", budgetId )

    const data = {
        income: 0,
        expenses: 0,
        currency: budget.getString( "defaultCurrency" ),
        balance: 0
    }

    let transactions = $app.dao().findRecordsByFilter(
        "transactions",
        `budget = "${budgetId}" && created >= "${startOf}" && created <= "${endOf}"`,
    )

    $app.dao().expandRecords( transactions, [ "account" ], null )

    transactions = JSON.parse( JSON.stringify(transactions));

    transactions?.forEach( record =>
    {
        if (record.expand.account.currency === budget.getString( "defaultCurrency" )) {
            if (record.type === 'income' ) {
                data.income = data.income + record.amount
            }

            if (record.type === 'expenses') {
                data.expenses = data.expenses + record.amount
            }

            if (record.type == 'cd') {
                data.balance = data.balance + record.amount
            }
        }
    });

    data.balance = data.balance + data.income - data.expenses;

    return c.json( 200, data );
}, $apis.requireRecordAuth('users'))

cronAdd( "checkCDs", "0 0 1 * *", () =>
{
    const today = new Date()
    const startOf = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0).toISOString()
    const endOf = new Date( today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59 ).toISOString()

    let accounts = $app.dao().findRecordsByExpr(
        "accounts",
    );
    accounts = JSON.parse( JSON.stringify(accounts));

    const prewMonthStart = new Date(startOf).setMonth( new Date( startOf ).getMonth() - 1 )
    const prewMonthEnd = new Date( endOf ).setMonth( new Date( endOf ).getMonth() - 1 )
    const createdDate = new Date( startOf ).setDate( 15 )

    accounts.forEach(account => {
        let transactions = $app.dao().findRecordsByFilter(
            "transactions",
            `account = "${account.id}" && created >= "${startOf}" && created <= "${endOf}"`,
        )
        transactions = JSON.parse( JSON.stringify( transactions ) );

        const cd = transactions?.find((t) => t.type === 'cd' );

        if (!cd) {
            let prewMonthTransactions = $app.dao().findRecordsByFilter(
                "transactions",
                `account = "${account.id}" && created >= "${new Date(prewMonthStart).toISOString()}" && created <= "${new Date(prewMonthEnd).toISOString()}"`,
            )
            prewMonthTransactions = JSON.parse( JSON.stringify( prewMonthTransactions ) )

            const accountData = {
                income: 0,
                expenses: 0,
                balance: 0
            };

            prewMonthTransactions?.forEach( (record) =>
            {
                if (record.type === 'income') {
                    accountData.income = accountData.income + record.amount
                }
                if (record.type === 'expenses') {
                    accountData.expenses = accountData.expenses + record.amount
                }
                if (record.type === 'cd') {
                    accountData.balance = accountData.balance + record.amount
                }
            } );

            const total = accountData.balance + accountData.income - accountData.expenses;

            const collection = $app.dao().findCollectionByNameOrId( "transactions" )
            const newTransaction = new Record(collection, {
                amount: total,
                account: account.id,
                type: 'cd',
                transfer: null,
                category: null,
                budget: account.budget,
                user: null,
                created: new Date(createdDate).toISOString()
            })
            $app.dao().saveRecord(newTransaction)
        }
    });
})