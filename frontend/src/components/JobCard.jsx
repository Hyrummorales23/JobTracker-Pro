function JobCard() {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Job Title</h3>
          <p className="text-sm text-gray-600">Company Name</p>
        </div>
        <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
          Applied
        </span>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
        <p>
          <span className="font-medium text-gray-700">Date Applied:</span> MM/DD/YYYY
        </p>
        <p>
          <span className="font-medium text-gray-700">Job Link:</span> Pending
        </p>
      </div>

      <div className="mt-4 rounded-md bg-gray-50 p-3">
        <h4 className="text-sm font-semibold text-gray-700">Notes</h4>
        <p className="mt-1 text-sm text-gray-600">
          Notes for interviews, recruiter contacts, salary details, or follow-up reminders.
        </p>
      </div>
    </article>
  );
}

export default JobCard;
