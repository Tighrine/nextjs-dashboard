import { fetchLatestInvoices } from "@/app/lib/data";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { revalidatePath } from "next/cache";

type Invoice = {
    amount: string;
    id: string;
    name: string;
    image_url: string;
    email: string;
};

const UpdateLatestInvoice = () => {

    return (
        <form>
            <button onClick={async () => {
                'use server';
                revalidatePath('/dashboard');
            }} className="flex items-center pb-2 pt-6 cursor-pointer">
                <ArrowPathIcon className="h-5 w-5 text-gray-500" />
                <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
            </button>
        </form>
    );
};

export default UpdateLatestInvoice;
