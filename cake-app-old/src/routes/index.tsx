import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import Hero from "../components/hero/hero";
import Rules from "../components/rules/rules";

export default component$(() => {
  return (
    <>
      <Hero />
      <Rules />
    </>
  );
});

export const head: DocumentHead = {
  title: "Is it (F)ake?!",
  meta: [
    {
      name: "description",
      content: "Find the cake in this addictive game.",
    },
  ],
};
