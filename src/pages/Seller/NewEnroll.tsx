import React from 'react';

const NewEnroll: React.FC = () => {
  return (
    <>
      {/* Header Section */}
      <div className="mb-4">
        <h1 className="text-title-lg md:text-title-xl font-bold mb-3 md:mb-5">
          New Enrollment
        </h1>
      </div>

      {/* Enrollment Stats Section */}
      <div className="mb-4 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-5 lg:col-span-1 dark:border-strokedark dark:bg-boxdark">
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="text-title-lg md:text-title-xl font-bold mb-3">
              Total Enrollments
            </h3>
            <h4 className="text-title-xl md:text-title-xxl font-bold text-black dark:text-white">
              {150}
            </h4>
            <span className="text-base font-medium">Enrolled This Month</span>
          </div>
        </div>

        <div className="col-span-5 lg:col-span-1 dark:border-strokedark dark:bg-boxdark">
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark h-full">
            <div className="mt-4">
              <h3 className="text-title-lg md:text-title-xl font-bold mb-3 md:mb-5">
                New Enrollments
              </h3>
              <h4 className="text-title-xl md:text-title-xxl font-bold text-black dark:text-white">
                {20}
              </h4>
              <span className="text-base font-medium">Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Form Section */}
      <div className="mb-4 grid grid-cols-1 gap-4">
        <div className="col-span-5 lg:col-span-1">
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="text-title-lg md:text-title-xl font-bold mb-3">
              New Enrollment Form
            </h3>
            <form>
              <div className="mb-4">
                <label
                  className="block text-base font-medium mb-2"
                  htmlFor="name"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full rounded-md border border-stroke bg-white px-4 py-2 text-black dark:bg-boxdark dark:text-white dark:border-strokedark"
                  placeholder="Enter full name"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-base font-medium mb-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-md border border-stroke bg-white px-4 py-2 text-black dark:bg-boxdark dark:text-white dark:border-strokedark"
                  placeholder="Enter email address"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-base font-medium mb-2"
                  htmlFor="course"
                >
                  Select Course
                </label>
                <select
                  id="course"
                  className="w-full rounded-md border border-stroke bg-white px-4 py-2 text-black dark:bg-boxdark dark:text-white dark:border-strokedark"
                >
                  <option value="">Select a course</option>
                  <option value="course1">Course 1</option>
                  <option value="course2">Course 2</option>
                  <option value="course3">Course 3</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  className="block text-base font-medium mb-2"
                  htmlFor="phone"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="text"
                  className="w-full rounded-md border border-stroke bg-white px-4 py-2 text-black dark:bg-boxdark dark:text-white dark:border-strokedark"
                  placeholder="Enter phone number"
                />
              </div>

              <button
                type="submit"
                className="rounded-md bg-primary text-white px-6 py-2 font-medium hover:bg-primary-dark"
              >
                Submit Enrollment
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Placeholder for Additional Components */}
      {/* You can add charts, tables, or other components below */}
      <div className="mt-4 grid grid-cols-12 gap-4">
        <div className="col-span-12">
          {/* Additional component like a table or chart can go here */}
        </div>
      </div>
    </>
  );
};

export default NewEnroll;
