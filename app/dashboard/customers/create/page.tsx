import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
//import { fetchCustomers } from '@/app/lib/data';

const Page = async () => {
    //const customers = await fetchCustomers();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Customers', href: '/dashboard/cusomters' },
                    {
                        label: 'Create Customer',
                        href: '/dashboard/cusomters/create',
                        active: true,
                    },
                ]}
            />
            <Form />
        </main>
    );
}

export default Page;