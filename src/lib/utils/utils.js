import toast from 'svelte-french-toast';
import { onNavigate } from '$app/navigation';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { pb, loading, authModel } from '$lib/stores/pocketbase';
import { get } from 'svelte/store';
import { fileToken } from '$lib/stores/main';
import dayjs from 'dayjs';
import { PRODUCT_LIST } from './constants';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const getImageURL = (
	/** @type {string} */ collectionId,
	/** @type {string} */ recordId,
	/** @type {string} */ fileName,
	size = '64x64',
) => {
	return `${PUBLIC_POCKETBASE_URL}/api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
};

export const getPrivetImage = async (
	/** @type {{ [key: string]: any; }} */ record,
	/** @type {string} */ fileName,
	size = '64x64',
) => {
	return pb.files.getUrl(record, fileName, { token: get(fileToken), thumb: size });
};

// wrapper to execute a pocketbase pb request and generate alerts on failure
/**
 * @param {{ (): Promise<import("pocketbase").RecordAuthResponse<import("pocketbase").RecordModel>>; (): Promise<void>; (): Promise<void>; (): Promise<void>; (): Promise<void>; (): Promise<void>; (): Promise<void>; (): Promise<void>; (): Promise<void>; (): Promise<void>; (): Promise<void>; (): Promise<void>; (): Promise<void>; (): any; }} request
 */
export async function alertOnFailure(request) {
	try {
		await request();
	} catch (e) {
		const {
			message,
			data: { data = {} },
		} = e;
		if (message) toast.error(message);

		for (const key in data) {
			const { message } = data[key];
			if (message) toast.error(`${key}: ${message}`);
		}

		loading.set(false);
	}
}

/**
 * @param {HTMLDivElement} node
 * @param {{ (): boolean; (): boolean; (): boolean; (): any; }} handler
 */
export function clickOutside(node, handler) {
	const onClick = (/** @type {{ target: HTMLElement; defaultPrevented: any; }} */ event) =>
		node && !node.contains(event.target) && !event.defaultPrevented && handler();

	// @ts-ignore
	document.addEventListener('click', onClick, true);

	return {
		destroy() {
			// @ts-ignore
			document.removeEventListener('click', onClick, true);
		},
	};
}

/**
 * @param {number} value
 */
export function moneyFormat(value, currency = 'USD') {
	return !Number.isNaN(value)
		? new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: currency,
				minimumFractionDigits: 0,
			}).format(value)
		: 0;
}

export const preparePageTransition = () => {
	onNavigate(async (navigation) => {
		// @ts-ignore
		if (!document.startViewTransition) {
			return;
		}

		return new Promise((oldStateCaptureResolve) => {
			// @ts-ignore
			document.startViewTransition(async () => {
				oldStateCaptureResolve();
				await navigation.complete;
			});
		});
	});
};

export const getUniqueTags = (/** @type {any[]} */ array) => {
	return array.filter((currentValue, index, arr) => arr.indexOf(currentValue) === index);
};

export function isMobile() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
		? true
		: false;
}

export const checkSubscription = () => {
	const auth = get(authModel);
	// @ts-ignore
	const currentBudget = auth?.expand?.ledger;
	const subscription = currentBudget?.stripe;

	if (subscription?.unlimited === 1) {
		return 'unlimited'; // make unlimited plan
	}

	if (!subscription || !subscription?.subscriptionId) {
		return null;
	}

	if (trialGone()) {
		return null;
	}

	const isValid =
		subscription.productId &&
		dayjs(subscription.currentPeriodEnd).valueOf() + DAY_IN_MS > Date.now();

	if (!isValid) return null;
	return subscription.productId;
};

// hasAccess 1, 2, 3
export const hasAccess = (access = 1) => {
	const productId = checkSubscription();

	if (productId) {
		if (productId === 'unlimited') {
			return true; // unlimited plan
		}

		const product = PRODUCT_LIST.find((p) => p.id === productId);

		// @ts-ignore
		return product.access >= access;
	} else {
		return false;
	}
};

// TODO put it somewhere
export const trialGone = () => {
	const auth = get(authModel);
	// @ts-ignore
	const currentBudget = auth?.expand?.ledger;
	const subscription = currentBudget?.stripe;

	if (subscription.trial_end === 'now') {
		return true;
	}

	if (subscription.trial_end) {
		return subscription.trial_end + DAY_IN_MS > Date.now();
	}
};
