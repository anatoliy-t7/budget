
import toast from 'svelte-french-toast';

// wrapper to execute a pocketbase client request and generate alerts on failure
export async function alertOnFailure(request: () => void) {
    try {
        request();
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
