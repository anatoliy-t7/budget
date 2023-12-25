import toast from 'svelte-french-toast';

export const getImageURL = (collectionId: string, recordId: string, fileName: string, size = '24x24') => {
    return `http://localhost:8090/api/files/${collectionId}/${recordId}/${fileName}?thumb=${size}`;
};

// wrapper to execute a pocketbase client request and generate alerts on failure
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

export const serializeNonPOJOs = (obj: any) => {
    return structuredClone(obj);
};

export const validateData = async (formData: any, schema: any) => {
    const body = Object.fromEntries(formData);

    try {
        const data = schema.parse(body);
        return {
            formData: data,
            errors: null
        };
    } catch (err) {
        console.log('Error: ', err);
        const errors = err.flatten();
        return {
            formData: body,
            errors
        };
    }
};

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
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0
    }).format(value);
}
