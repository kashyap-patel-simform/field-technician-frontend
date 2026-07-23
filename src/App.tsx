import { useState } from 'react'
import { Button } from '@/components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <h1 className="text-3xl font-semibold text-foreground">
        Vite + React + TypeScript + Tailwind + shadcn/ui
      </h1>
      <Button onClick={() => setCount((count) => count + 1)}>
        Count is {count}
      </Button>
    </div>
  )
}

export default App
