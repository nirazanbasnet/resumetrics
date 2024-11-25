/* eslint-disable jsx-a11y/anchor-is-valid */
const people = [
    { username: 'Lindsay Walton', email: 'lindsay.walton@example.com', number_of_cv: '5', number_of_job_match: '10', user_type: 'premium' },
]

export default function AdminUserList() {
    const getUserType = (userType: string) => {
        switch (userType) {
            case 'premium':
                return 'bg-green-50 text-green-700 ring-green-600/20';
            case 'free':
                return 'bg-blue-50 text-blue-700 ring-blue-600/20';
            default:
                return 'bg-blue-50 text-blue-700 ring-blue-600/20';
        }
    }
    return (
        <div className="px-4 py-5 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold text-gray-900">Users</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all the users in your account including their name, title, email and role.
                    </p>
                </div>
            </div>
            <div className="flow-root mt-8">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                        Username
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Email
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Number of CV
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Number of Job Match
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Type of User
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {people.map((person) => (
                                    <tr key={person.email}>
                                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-0">
                                            {person.username}
                                        </td>
                                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">{person.email}</td>
                                        <td className="px-3 py-4 text-sm font-bold text-gray-500 whitespace-nowrap">{person.number_of_cv}</td>
                                        <td className="px-3 py-4 text-sm font-bold text-gray-500 whitespace-nowrap">{person.number_of_job_match}</td>
                                        <td className="px-3 py-3.5">
                                            <div className={`capitalize inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${getUserType(person.user_type)}`}>
                                                {person.user_type}
                                            </div>
                                        </td>
                                        <td className="relative py-4 pl-3 pr-4 text-sm font-medium whitespace-nowrap sm:pr-0">
                                            <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                Edit<span className="sr-only">, {person.username}</span>
                                            </a>
                                            <a href="#" className="ml-5 text-red-600 hover:text-red-900">
                                                Delete<span className="sr-only">, {person.username}</span>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
