'use server';

import { signIn } from '@/auth';
import { db } from '@vercel/postgres';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

const InvoiceSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0.' }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

const CreateInvoice = InvoiceSchema.omit({ id: true, date: true });

export const createInvoice = async (prevState: State, formData: FormData) => {
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    try {
        const client = await db.connect();
        await client.sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
    } catch (error) {
        throw new Error(`Database Error: Failed to Create Invoice. ${error}`);
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
};

export const updateInvoice = async (id: string, prevState: State, formData: FormData) => {
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;

    const amountInCents = amount * 100;
    try {
        const client = await db.connect();
        await client.sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
    } catch (error) {
        throw Error(`Database Error: Failed to Update Invoice. ${error}`);
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
};

export const deleteInvoice = async (id: string) => {
    //throw new Error('Failed to Delete Invoice');
    try {
        const client = await db.connect();
        await client.sql`
            DELETE FROM invoices
            WHERE id = ${id}
        `;
    } catch (error) {
        throw Error(`Database Error: Failed to Delete Invoice. ${error}`);
    }
    revalidatePath('/dashboard/invoices');
};

export const authenticate = async (prevState: string | undefined, formData: FormData) => {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
};