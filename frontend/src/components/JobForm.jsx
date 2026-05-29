function JobForm() {
  return (
    <section className="rounded-lg bg-white p-6 shadow">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Add Job Application</h2>
        <p className="mt-1 text-sm text-gray-600">
          Basic form layout for Sprint 2 job application CRUD.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <div className="mt-2 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500">
            Company input placeholder
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Job Title</label>
          <div className="mt-2 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500">
            Job title input placeholder
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date Applied</label>
          <div className="mt-2 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500">
            Date input placeholder
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <div className="mt-2 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500">
            Status select placeholder
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <div className="mt-2 min-h-24 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500">
          Notes textarea placeholder
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Save Job
        </button>
      </div>
    </section>
  );
}

export default JobForm;
