import SearchBar from "./components/SearchBar"

function App() {

  return (
    <main className="w-full min-h-screen flex flex-col items-center bg-zinc-50">
      <div className="w-full h-100 flex flex-col justify-between bg-zinc-900 p-6">
        <div>
          <h1 className="text-zinc-50 text-8xl font-bebas">
            MovieMatch
          </h1>
          <p className="text-zinc-200 ml-5">
            Find the perfect movie to watch together.
          </p>
        </div>

        <div className="w-full flex justify-center">
          <SearchBar />
        </div>
      </div>
      
    </main>
  )
}

export default App
