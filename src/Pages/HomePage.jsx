import { Fragment, useRef, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Bars3Icon, ChevronRightIcon, CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import axios from 'axios';
import Cookies from 'js-cookie';
import { NavLink, Navigate, useNavigate } from 'react-router-dom';

const navigation = [
  { name: 'Projects', href: '#', icon: FolderIcon, current: false },
  { name: 'Deployments', href: '#', icon: ServerIcon, current: true },
  { name: 'Activity', href: '#', icon: SignalIcon, current: false },
  { name: 'Domains', href: '#', icon: GlobeAltIcon, current: false },
  { name: 'Usage', href: '#', icon: ChartBarSquareIcon, current: false },
  { name: 'Settings', href: '#', icon: Cog6ToothIcon, current: false },
]
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}



// More deployments...

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [open, setOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false);
  const cancelButtonRef = useRef(null)
  const navigation = useNavigate();
  const [formData, setFormData] = useState({
    Name: '',
    Gender: '',
    Address: '',
    Amount: 0,
    Rate: 0,
    Category: '',
    Weight: '',
    Status: '',
    Date: new Date().toISOString().substr(0, 10),
    PaymentDate: new Date().toISOString().substr(0, 10),
    PaymentAmount: 0,
    PhoneNumber: '',
    Remarks: '',
    PreviousPayments: [],
  });

  const handleClose = () => {
    setOpen(false);
  };
  const goToDash = () => {
    navigation('/dashboard');
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = Cookies.get("token");

      console.log("token", token)
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await axios.post(
        "http://localhost:8080/user/add",
        formData,
        {
          headers,
        }
      );
      setIsLoading(false);
      toast.success("Form submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      goToDash();
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <div>
        <header className="bg-white">
          <nav className="mx-auto flex max-w-7xl items-center justify-around p-2 sm:p-6 lg:px-8" aria-label="Global">
            <a href="#" className="sm:-m-1.5 sm:p-1.5">
              <span className="sr-only">Your Company</span>
              <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="" />
            </a>
            <button>Home</button>
            <NavLink to="/dashboard"><button>Dashboard</button></NavLink>
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
                  className="block w-full rounded-md border-2 border-black bg-gray-400 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-black focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="Search"
                  type="search"
                />
              </div>
            </div>
          </nav>
        </header>

        <hr/>


          <main className="lg:pr-96">
            <Transition.Root show={open} as={Fragment}>
              <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                  <div className="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      enterTo="opacity-100 translate-y-0 sm:scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                      leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                      <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                        <form onSubmit={handleSubmit}>
                          <div>
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                              <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                            </div>
                            <div className="mt-3 text-center sm:mt-5">
                              <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                Add Details
                              </Dialog.Title>
                              <div className="mt-2">
                                <div className="relative">
                                  <label
                                    htmlFor="name"
                                    className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                  >
                                    Name
                                  </label>
                                  <input
                                    type="text"
                                    name="Name"
                                    id="Name"
                                    value={formData.Name}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    required
                                  />
                                </div>
                                <div className="relative mt-3">
                                  <select
                                    name="Gender"
                                    id="Gender"
                                    value={formData.Gender}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border rounded-md ring-1 ring-inset ring-gray-300 text-gray-900 "
                                    required
                                  >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                  </select>
                                </div>

                                <div className="relative mt-3">
                                  <label
                                    htmlFor="name"
                                    className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
                                  >
                                    Address
                                  </label>
                                  <input
                                    type="text"
                                    name="Address"
                                    id="address"
                                    value={formData.Address}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Jane Smith"
                                  />
                                </div>
                                <div className="relative mt-3">
                                  <label htmlFor="Amount" className="absolute -top-2 left-2 inline-block bg-white px-1 text-sm font-medium text-gray-700">
                                    Amount
                                  </label>
                                  <input
                                    id="amount"
                                    name="Amount"
                                    type="number"
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    required
                                  /></div>
                                <div className="relative mt-3">
                                  <label htmlFor="Rate" className="absolute -top-2 left-2 inline-block bg-white px-1 text-sm font-medium text-gray-700">
                                    Rate
                                  </label>
                                  <input
                                    id="rate"
                                    name="Rate"
                                    type="number"
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    required
                                  /></div>
                                <div className="relative mt-3">
                                  <label htmlFor="Weight" className="absolute -top-2 left-2 inline-block bg-white px-1 text-sm font-medium text-gray-700">
                                    Weight
                                  </label>
                                  <input
                                    id="weight"
                                    name="Weight"
                                    type="text"
                                    placeholder="Enter weight/pcs of product"
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    required
                                  />
                                </div>
                                <div className="relative mt-3">
                                  <label htmlFor="Category" className="absolute -top-2 left-2 inline-block bg-white px-1 text-sm font-medium text-gray-700">
                                    Category
                                  </label>
                                  <select
                                    id="category"
                                    name="Category"
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    required
                                  >
                                    <option value="">Select Category</option>
                                    <option value="Gold">Gold</option>
                                    <option value="Silver">Silver</option>
                                    <option value="Bronze">Bronze</option>
                                    <option value="Bike">Bike</option>
                                    <option value="Cycle">Cycle</option>
                                    <option value="Others">Others</option>
                                  </select></div>
                                <div className="relative mt-3">
                                  <label htmlFor="Status" className="absolute -top-2 left-2 inline-block bg-white px-1 text-sm font-medium text-gray-700">
                                    Status
                                  </label>
                                  <select
                                    id="status"
                                    name="Status"
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    required
                                  >
                                    <option value="">Select Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Renew">Renew</option>
                                  </select></div>
                                <div className="relative mt-3">
                                  <label htmlFor="Date" className="absolute -top-2 left-2 inline-block bg-white px-1 text-sm font-medium text-gray-700">
                                    Loan Date
                                  </label>
                                  <input
                                    id="date"
                                    name="Date"
                                    type="date"
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    required
                                  /></div>
                                {/* <div className="relative mt-3">
                                  <label htmlFor="PaymentDate" className="absolute -top-2 left-2 inline-block bg-white px-1 text-sm font-medium text-gray-700">
                                    Payment Date
                                  </label>
                                  <input
                                    id="paymentDate"
                                    name="PaymentDate"
                                    type="date"
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    required
                                  />
                                </div> */}
                                {/* <div className="relative mt-3">
                                  <label htmlFor="PhoneNumber" className="absolute -top-2 left-2 inline-block bg-white px-1 text-sm font-medium text-gray-700">
                                    Payment Amount
                                  </label>
                                  <input
                                    id="paymentAmount"
                                    name="PaymentAmount"
                                    type="number"
                                    placeholder="Enter Loan Amount"
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border rounded-md"
                                    required
                                  />
                                </div> */}
                                <div className="relative mt-3">
                                  <label htmlFor="PhoneNumber" className="absolute -top-2 left-2 inline-block bg-white px-1 text-sm font-medium text-gray-700">
                                    Phone Number
                                  </label>
                                  <input
                                    id="phoneNumber"
                                    name="PhoneNumber"
                                    type="tel"
                                    placeholder="Enter phone number"
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border rounded-md"
                                  />
                                </div>

                                <div className="relative mt-3">
                                  <label
                                    htmlFor="remarks"
                                    className="absolute -top-2 left-2 inline-block bg-white px-1 text-sm font-medium text-gray-700"
                                  >
                                    Remarks
                                  </label>
                                  <textarea
                                    id="remarks"
                                    name="Remarks"
                                    value={formData.Remarks}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Additional details"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                              <button
                                type="submit"
                                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <ThreeDots
                                    height={10}
                                    radius="10"
                                    color="blue"
                                    ariaLabel="three-dots-loading"
                                    wrapperStyle={{}}
                                    wrapperClassName=""
                                    visible={true}
                                    className="items-center m-auto"
                                  />
                                ) : (
                                  "Save"
                                )}
                              </button>

                              <button
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                                onClick={handleClose}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </form>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>
          </main>

      </div>
    </>
  )
}

