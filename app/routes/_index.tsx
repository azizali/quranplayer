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
    <div className="flex flex-col justify-center h-screen mx-4">
      <QuranApp />
    </div>
  );
}
