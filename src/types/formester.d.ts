import "react";

type FormesterStandardFormProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement> & {
    "set-auto-height"?: string;
    height?: string;
    width?: string;
    id?: string;
    url?: string;
  },
  HTMLElement
>;

// Classic global JSX namespace (older React / @types/react versions).
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "formester-standard-form": FormesterStandardFormProps;
    }
  }
}

// React 18.3+/19 moved the JSX namespace under the "react" module.
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "formester-standard-form": FormesterStandardFormProps;
    }
  }
}

export {};