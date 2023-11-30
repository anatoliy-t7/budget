import { writable, readable, readonly, derived } from 'svelte/store';
import { client } from '$lib/pocketbase';

const coll = client.collection( 'transactions' );

export const types = readable( [
    'expenses', 'income', 'transfer'
] )

export const list = writable( null )

export const loading = writable( false )
export const error = writable( false )
export const categories = writable( await getCategories() )
export const accounts = writable( await getAccounts() )

async function getCategories ()
{
    // loading.set(true)
    const coll = client.collection( 'categories' );
    return await coll.getFullList( {
        sort: '-name', fields: 'id,name,icon',
    } )
}

async function getAccounts ()
{
    // loading.set(true)
    const coll = client.collection( 'accounts' );
    return await coll.getFullList( {
        sort: '-name', fields: 'id,name',
    } )
}

// export const page = writable( 1 )
// export const getList = async ( { origin, storeId, isCors, forceUpdate = false } ) =>
// {

//     await coll.getList( page, 5, {
//         sort: '-created',
//         expand: 'category,account,user',
//         fields:
//             'created,amount,type,note,transfer,expand.category.name,expand.account.name,expand.account.currency,expand.user.email',
//     } );

//     coll.subscribe( '*', function ( e )
//     {
//         console.log( e.action );
//         console.log( e.record );
//     } );


// }
