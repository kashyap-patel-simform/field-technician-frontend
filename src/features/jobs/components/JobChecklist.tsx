import { ERROR_MESSAGES } from "@/constants";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useChecklist } from "@/features/jobs/hooks/useChecklist";
import { useToggleChecklistItem } from "@/features/jobs/hooks/useToggleChecklistItem";
import { cn } from "@/lib/utils";

export function JobChecklist({
  jobId,
  disabled,
}: {
  jobId: string;
  disabled?: boolean;
}) {
  const { data: items, isPending } = useChecklist(jobId);
  const toggleMutation = useToggleChecklistItem(jobId);

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-muted-foreground">Checklist</h2>

      {isPending ? (
        <Skeleton className="h-40 rounded-xl" />
      ) : (
        <Card className="divide-y p-0">
          {items?.map((item) => (
            <label
              key={item.id}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm",
                disabled && "opacity-50",
              )}
            >
              <Checkbox
                checked={item.isCompleted}
                disabled={disabled}
                onCheckedChange={() => toggleMutation.mutate(item.id)}
              />
              <span
                className={cn(
                  item.isCompleted && "text-muted-foreground line-through",
                )}
              >
                {item.label}
              </span>
            </label>
          ))}
        </Card>
      )}

      {toggleMutation.isError && (
        <p role="alert" className="text-xs text-destructive">
          {ERROR_MESSAGES.CHECKLIST_UPDATE_FAILED}
        </p>
      )}
    </section>
  );
}
