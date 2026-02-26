import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/speech-to-text")({
  component: SpeechToTextPage,
});

function SpeechToTextPage() {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Speech To Text</h1>
      <p className="text-muted-foreground">ASR fine-tuning workspace placeholder.</p>
    </section>
  );
}
