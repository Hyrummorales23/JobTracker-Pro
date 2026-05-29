import JobCard from './JobCard';

function JobList() {
  return (
    <section className="rounded-lg bg-white p-6 shadow">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Job Applications</h2>
        <p className="mt-1 text-sm text-gray-600">
          Basic list layout for displaying saved job applications.
        </p>
      </div>

      <div className="space-y-4">
        <JobCard />
        <JobCard />
      </div>
    </section>
  );
}

export default JobList;
