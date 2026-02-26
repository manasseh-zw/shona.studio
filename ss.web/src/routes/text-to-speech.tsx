import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/text-to-speech")({
  component: TextToSpeechPage,
});

function TextToSpeechPage() {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Text To Speech</h1>
      <p className="text-muted-foreground">TTS fine-tuning workspace placeholder.</p>
    </section>
  );
}
