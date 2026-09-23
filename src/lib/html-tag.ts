import type { ElementType } from "react";

// The element a polymorphic `as` prop may render: an HTML tag or a component. React Three Fiber
// adds its three.js elements to JSX's intrinsic elements, and a bare ElementType would take those
// in too (their props collapse the union to never).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HtmlTag = ElementType<any, keyof HTMLElementTagNameMap>;
