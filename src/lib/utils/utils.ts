import toast from 'svelte-french-toast';
import { onNavigate } from '$app/navigation';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { pb, loading, authModel } from '$lib/stores/pocketbase';
import { get } from 'svelte/store';
import { fileToken, budget } from '$lib/stores/main';
import type { RecordModel } from 'pocketbase';
import dayjs from 'dayjs';
import { PRODUCT_LIST } from './constants';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const getImageURL = (collectionId: string, recordId: string, fileName: string, size = '64x64') => {
    return `${PUBLIC_POCKETBASE_URL}/api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
};

export const getPrivetImage = async (record: RecordModel, fileName: string, size = '64x64') => {
    return pb.files.getUrl(record, fileName, { 'token': get(fileToken), 'thumb': size });
};

// wrapper to execute a pocketbase pb request and generate alerts on failure
export async function alertOnFailure(request: () => void) {
    try {
        await request();
    } catch (e: any) {
        const {
            message,
            data: { data = {} },
        } = e;
        if (message) toast.error(message);

        for (const key in data) {
            const { message } = data[key];
            if (message) toast.error(`${key}: ${message}`);
        }

        loading.set(false)
    }
}

export function clickOutside(
    node: HTMLElement,
    handler: () => void
): { destroy: () => void } {
    const onClick = (event: MouseEvent) =>
        node &&
        !node.contains(event.target as HTMLElement) &&
        !event.defaultPrevented &&
        handler();

    document.addEventListener('click', onClick, true);

    return {
        destroy() {
            document.removeEventListener('click', onClick, true);
        },
    };
}

export function moneyFormat(value: number, currency: string = 'USD') {
    return !Number.isNaN(value) ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0
    }).format(value) : 0;
}

export const preparePageTransition = () => {
    onNavigate(async (navigation) => {
        if (!document.startViewTransition) {
            return;
        }

        return new Promise((oldStateCaptureResolve) => {
            document.startViewTransition(async () => {
                oldStateCaptureResolve();
                await navigation.complete;
            });
        });
    });
};

export const getUniqueTags = (array: any) => {
    return array.filter((currentValue: any, index: number, arr: any) => arr.indexOf(currentValue) === index);
}

export function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false
}

export const checkSubscription = () => {
    const auth = get(authModel)
    const currentBudget = auth?.expand?.budget
    const subscription = currentBudget?.stripe

    if (subscription.unlimited === 1) {
        return 'unlimited' // make unlimited plan
    }

    if (!subscription && !subscription?.subscriptionId) {
        return null;
    }

    const isValid = subscription.productId && dayjs(subscription.currentPeriodEnd).valueOf() + DAY_IN_MS > Date.now();

    if (!isValid) return null;
    return subscription.productId;
};

// hasAccess 1, 2, 3
export const hasAccess = (access: number = 1) => {
    const productId = checkSubscription()

    if (productId) {

        if (productId === 'unlimited') {
            return true; // unlimited plan
        }

        const product: any = PRODUCT_LIST.find((p: any) => p.id === productId)


        return product.access >= access;
    } else {
        return false
    }
}

// TODO put it somewhere
export const checkTrial = () => {
    const auth = get(authModel)
    const currentBudget = auth?.expand?.budget
    const subscription = currentBudget?.stripe

    if (subscription.trial_end === 'now') {
        return true;
    }

    if (subscription.trial_end) {
        return subscription.trial_end + DAY_IN_MS > Date.now();
    }
}
