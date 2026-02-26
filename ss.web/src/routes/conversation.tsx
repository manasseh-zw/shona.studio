import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/conversation")({
  component: ConversationPage,
});

function ConversationPage() {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Conversation</h1>
      <p className="text-muted-foreground">
        Shona conversation layer workspace placeholder.
      </p>
    </section>
  );
}
