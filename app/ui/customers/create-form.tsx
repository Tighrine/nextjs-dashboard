'use client';

const Form = () => {
    return (
        <form>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                <div className="mb-4">
                    <label htmlFor="customerName" className="mb-2 block text-sm font-medium">Customer Name</label>
                    <input type="text" id="customerName" name="customerName" className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500" />
                </div>
                <div className="mb-4">
                    <label htmlFor="customerEmail" className="mb-2 block text-sm font-medium">Customer Email</label>
                    <input type="email" id="customerEmail" name="customerEmail" className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500" />
                </div>
                <div className="mb-4">
                    <label htmlFor="customerImage" className="mb-2 block text-sm font-medium">Image url</label>
                    <input type="text" id="customerImage" name="customerImage" className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500" />
                </div>
                <button type="submit">Create Customer</button>
            </div>
        </form>
    );
};

export default Form;