import type { MetaFunction } from "@remix-run/deno";
import QuranApp from "~/components/QuranApp";
import { appName } from "~/components/config";

export const meta: MetaFunction = () => {
  return [
    { title: `${appName} Helper` },
    { name: "description", content: `${appName} Helper` },
  ];
};

export default function Index() {
  return <QuranApp />;
}
