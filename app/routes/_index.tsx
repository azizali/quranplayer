import type { MetaFunction } from "@remix-run/deno";
import QuranApp from "~/components/QuranApp";

export const meta: MetaFunction = () => {
  return [
    { title: "Quran Audio Player" },
    { name: "description", content: "Quran Audio Player" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <QuranApp />
    </div>
  );
}
