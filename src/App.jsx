import { useEffect } from "react";
import { useState } from "react";

function App() {
  const [jobs, setJobs] = useState(null);
  const [lastItemIndex, setLastItemIndex] = useState(5);
  const [totalItems, setTotalItems] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = () => {
    setLoading(true);
    let newIdx = lastItemIndex + 5;
    if (newIdx > totalItems) {
      newIdx = totalItems;
    }
    setLastItemIndex(newIdx);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch(
        "https://hacker-news.firebaseio.com/v0/jobstories.json"
      );
      const idArray = await response.json();
      setTotalItems(idArray.length);

      const jobPromises = idArray.slice(0, lastItemIndex).map((id) => {
        return fetch(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        ).then((res) => res.json());
      });
      const jobArray = await Promise.all(jobPromises);
      console.log(jobArray);
      setJobs(jobArray);
      setLoading(false);
    };
    fetchJobs();
  }, [lastItemIndex]);
  return (
    <div className="overflow-x-hidden min-h-screen mb-6">
      <div className="md:w-[60%] w-[90%] mx-auto">
        <h1 className=" my-3 text-3xl font-bold text-orange-600">
          Hacker News Jobs Board
        </h1>

        {jobs ? (
          <div>
            <div className="mt-2 flex flex-col gap-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3 border border-gray-400 bg-white"
                >
                  <a
                    href={job.url}
                    className="text-xl block font-semibold hover:underline"
                  >
                    {job.title}
                  </a>
                  <div className="mt-4 text-sm flex gap-5">
                    <span>
                      {" "}
                      By: {job.by.split("_").join(" ").toUpperCase() + " "}
                    </span>
                    <span>{new Date(job.time * 1000).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            {totalItems && jobs.length < totalItems && (
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="mt-3 text-sm text-white rounded-md px-2 py-1 bg-orange-600"
              >
                {loading ? "Loading..." : "Load more jobs"}
              </button>
            )}
          </div>
        ) : (
          <h1 className="text-gray-600 text-xl font-bold">Loading...</h1>
        )}
      </div>
    </div>
  );
}

export default App;
