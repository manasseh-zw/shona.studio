import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dataset")({
  component: DatasetPage,
});

function DatasetPage() {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Datasets</h1>
      <p className="text-muted-foreground">
        Dataset studio will appear here in the next iteration.
      </p>
    </section>
  );
}
