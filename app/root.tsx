import { useSWEffect } from "@remix-pwa/sw";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "~/app.css";
import stylesheet from "~/tailwind.css?url";
export const links = () => [{ rel: "stylesheet", href: stylesheet }];

export default function App() {
  useSWEffect();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-100">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
