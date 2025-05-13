const TopBar = () => {
  const userName = "John Doe"

  return (
    <header className="bg-white shadow">
      <div className="flex justify-between items-center px-6 py-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        </div>
        <div className="flex items-center">
          <div className="relative">
            <button className="flex items-center focus:outline-none">
              <img
                className="h-8 w-8 rounded-full object-cover"
                src="https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff"
                alt="Profile"
              />
              <span className="ml-2 text-gray-700">{userName}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopBar 