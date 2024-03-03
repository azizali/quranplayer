import type { MetaFunction } from "@remix-run/deno";
import QuranApp from "~/components/QuranApp";

export const meta: MetaFunction = () => {
  return [
    { title: "Quran Hifz Helper" },
    { name: "description", content: "Quran Hifz Helper" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <QuranApp />
    </div>
  );
}
