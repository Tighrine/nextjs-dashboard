import { z } from "zod";

const CustomerSchema = z.object({
    id: z.string(),
    name: z.string({
        invalid_type_error: 'Please enter a customer name.',
    }),
    email: z.string().email({
        message: 'Please enter a valid email address.',
    }),
    image_url: z.string().url({
        message: 'Please enter a valid URL for the customer image.',
    }),
});

const CreateCustomer = CustomerSchema.omit({ id: true });

export type State = {
    errors?: {
        name?: string[];
        email?: string[];
        image_url?: string[];
    };
    message?: string | null;
};
export async function createCustomer(prevState: State, formData: FormData) {
    const validatedFields = CreateCustomer.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        image_url: formData.get('image_url'),
    });
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Customer.',
        };
    }
    const { name, email, image_url } = validatedFields.data;
    const image_url_with_default = image_url || '/customer-placeholder.png';
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                image_url: image_url_with_default,
            }),
        });
        if (!res.ok) {
            return {
                message: 'Database Error: Failed to Create Customer.',
            };
        }
        return { message: 'Created Customer!' };
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Customer.' + error,
        };
    }
}