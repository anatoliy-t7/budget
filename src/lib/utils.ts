import toast from 'svelte-french-toast';
import { onNavigate } from '$app/navigation';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { pb } from '$lib/stores/pocketbase';
import { get } from 'svelte/store';
import { fileToken } from '$lib/stores/main';
import type { RecordModel } from 'pocketbase';

export const getImageURL = (collectionId: string, recordId: string, fileName: string, size = '64x64') => {
    return `${PUBLIC_POCKETBASE_URL}/api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
};

export const getPrivetImage = async (record: RecordModel, fileName: string, size = '64x64') => {
    return pb.files.getUrl(record, fileName, { token: get(fileToken), thumb: size });
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

    console.log('array', array);

    return array.filter((currentValue: any, index: number, arr: any) => arr.indexOf(currentValue) === index);
}
