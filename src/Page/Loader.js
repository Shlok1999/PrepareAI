export function Loader() {
    return (
      <div className="grid gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
            <div className="mt-4 flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-6 w-20 bg-gray-300 rounded"></div>
              ))}
            </div>
            <div className="mt-4 h-10 w-full bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }
  