import { createFileRoute } from "@tanstack/react-router";
import { LabApp } from "@/components/lab/LabApp";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <LabApp />;
}
