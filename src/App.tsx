import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
      <h1 className="text-3xl font-semibold text-gray-900">
        Vite + React + TypeScript + Tailwind
      </h1>
      <button
        type="button"
        className="rounded-md bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
        onClick={() => setCount((count) => count + 1)}
      >
        Count is {count}
      </button>
    </div>
  )
}

export default App
