import { Dialog } from "@headlessui/react"
import { Bars3Icon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline"
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"


export default function Dashboard() {
    const [formData, setFormData] = useState([]);
    const token = Cookies.get("token");
    useEffect(() => {
        if (token) {
            axios.get("http://localhost:8080/user/get", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    setFormData(response.data);
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        }
    }, [token]);
    function formatDate(dateString) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    console.log(formData.Name)
    return (<>
        <header className="bg-gray-950 sticky top-0 z-50">
            <nav className="mx-auto flex max-w-7xl items-center justify-around p-2 sm:p-6 lg:px-8" aria-label="Global">
                <a href="#" className="sm:-m-1.5 sm:p-1.5">
                    <span className="sr-only">Your Company</span>
                    <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
                </a>
                <NavLink to="/home"><button className="text-white">Home</button></NavLink>
                <NavLink to="/dashboard"><button className="text-white">Dashboard</button></NavLink>
                <div className="w-[50%] max-w-lg lg:max-w-xs">
                    <label htmlFor="search" className="sr-only">
                        Search
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            id="search"
                            name="search"
                            className="block w-full rounded-md border-2 border-black bg-gray-100 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-black focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Search"
                            type="search"
                        />
                    </div>
                </div>
            </nav>
        </header>
        <hr />
        <div className=" sm:px-6 lg:px-8 bg-white flow-root">
                <div className=" sm:-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle ">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="sticky top-50  pl-8  text-left text-md font-semibold text-gray-900 ">
                                        Name
                                    </th>
                                <th scope="col" className="sticky top-50 px-3 py-3.5 text-left text-md font-semibold text-gray-900">
                                        Date
                                    </th>
                                <th scope="col" className="sticky top-50 px-3 py-3.5 text-left text-md font-semibold text-gray-900">
                                        Category
                                    </th>
                                <th scope="col" className="sticky top-50 px-3 py-3.5 text-left text-md font-semibold text-gray-900">
                                        Amount
                                    </th>
                                <th scope="col" className="sticky top-50 px-3 py-3.5 text-left text-md font-semibold text-gray-900">
                                         Status
                                    </th>
                                <th scope="col" className="sticky top-50 px-3 py-3.5 text-left text-md font-semibold text-gray-900">
                                        Rate
                                    </th>
                                <th scope="col" className="sticky top-50  py-3.5 pl-3 pr-4 sm:pr-0">
                                    Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {formData.map((data) => (
                                    <tr key={data._id}>
                                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                            <div className="ml-4">
                                                <div className="font-medium text-gray-900">{data.Name}</div>
                                                <div className="mt-1 text-gray-600">{data._id}</div>
                                            </div>
                                        </td>
                                        <td>
                                            {formatDate(data.Date)}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-5 text-sm text-black">
                                            {data.Category}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-5 text-sm text-black">
                                            {data.Amount}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-5 text-sm text-black">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${data.Status === "Active" ? "bg-green-50 text-green-700 ring-green-600/20" : data.Status === "Completed" ? "bg-red-500 text-white ring-red-600/20" : "bg-blue-500 text-white ring-blue-600/20"}`}>
                                                {data.Status === "Active" ?<span className="h-1 w-1 bg-green-500 rounded-full mr-1 animate-pulse"></span>:null} {/* Glowing dot */}
                                                {data.Status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-5 text-sm text-black">
                                            {data.Rate}
                                        </td>
                                        <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                            <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                Edit
                                            </a>
                                            <span className="mx-2">|</span>
                                            <a href="#" className="text-blue-600 hover:text-blue-900">
                                                View
                                            </a>
                                            <span className="mx-2">|</span>
                                            <a href="#" className="text-red-600 hover:text-red-900">
                                                Delete
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
            </div>
        </div>

        </>
    )
}
