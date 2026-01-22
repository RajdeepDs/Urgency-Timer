import { DataTable, Card } from "@shopify/polaris";
import { StatusBadge } from "../ui/StatusBadge";
import type { Timer } from "../../types/timer";

interface TimerDataTableProps {
  timers: Timer[];
  onTimerClick?: (timerId: string) => void;
}

export function TimerDataTable({ timers }: TimerDataTableProps) {
  const rows = timers.map((timer) => [
    timer.name,
    timer.type,
    <StatusBadge key={timer.id} isPublished={timer.isPublished} />,
  ]);

  return (
    <Card padding="0">
      <DataTable
        columnContentTypes={["text", "text", "text"]}
        headings={["Timer name", "Type", "Status"]}
        rows={rows}
        stickyHeader
      />
    </Card>
  );
}
