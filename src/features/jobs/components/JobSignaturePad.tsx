import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSignature } from '@/features/jobs/hooks/useSignature'
import { useSubmitSignature } from '@/features/jobs/hooks/useSubmitSignature'

export function JobSignaturePad({ jobId }: { jobId: string }) {
  const { data: signature, isPending } = useSignature(jobId)
  const submitMutation = useSubmitSignature(jobId)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawingRef = useRef(false)
  const [hasStrokes, setHasStrokes] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    context.lineWidth = 2
    context.lineCap = 'round'
    context.strokeStyle = 'currentColor'
  }, [])

  function getContext() {
    return canvasRef.current?.getContext('2d') ?? null
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    const context = getContext()
    if (!canvas || !context) return
    isDrawingRef.current = true
    const rect = canvas.getBoundingClientRect()
    context.beginPath()
    context.moveTo(event.clientX - rect.left, event.clientY - rect.top)
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    const context = getContext()
    if (!canvas || !context || !isDrawingRef.current) return
    const rect = canvas.getBoundingClientRect()
    context.lineTo(event.clientX - rect.left, event.clientY - rect.top)
    context.stroke()
    setHasStrokes(true)
  }

  function handlePointerUp() {
    isDrawingRef.current = false
  }

  function handleClear() {
    const canvas = canvasRef.current
    const context = getContext()
    if (!canvas || !context) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    setHasStrokes(false)
  }

  function handleSave() {
    const canvas = canvasRef.current
    if (!canvas) return
    submitMutation.mutate(canvas.toDataURL('image/png'))
  }

  if (isPending) {
    return <Skeleton className="h-48 rounded-xl" />
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-muted-foreground">Customer Signature</h2>

      {signature ? (
        <img
          src={signature.dataUrl}
          alt="Customer signature"
          className="h-40 rounded-xl border bg-white"
        />
      ) : (
        <>
          <canvas
            ref={canvasRef}
            width={343}
            height={160}
            className="touch-none rounded-xl border bg-white text-foreground"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleClear}>
              Clear
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!hasStrokes || submitMutation.isPending}
              onClick={handleSave}
            >
              {submitMutation.isPending ? 'Saving…' : 'Save Signature'}
            </Button>
          </div>
        </>
      )}
    </section>
  )
}
