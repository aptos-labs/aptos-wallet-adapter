import { ReactNode } from "react";
export interface HeadlessComponentProps {
    /** A class name for styling the element. */
    className?: string;
    /**
     * Whether to render as the child element instead of the default element provided.
     * All props will be merged into the child element.
     */
    asChild?: boolean;
    children?: ReactNode;
}
/**
 * Gets an HTML element type from its tag name
 * @example
 * HTMLElementFromTag<"img"> // resolved type: HTMLImageElement
 */
type HTMLElementFromTag<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T] extends React.ClassAttributes<infer Element> ? Element : HTMLElement;
export declare function createHeadlessComponent<TElement extends keyof JSX.IntrinsicElements>(displayName: string, elementType: TElement, props?: JSX.IntrinsicElements[TElement] | ((displayName: string) => JSX.IntrinsicElements[TElement])): import("react").ForwardRefExoticComponent<HeadlessComponentProps & import("react").RefAttributes<HTMLElementFromTag<TElement>>>;
export {};
//# sourceMappingURL=utils.d.ts.map