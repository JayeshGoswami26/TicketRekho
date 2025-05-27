declare module 'react-csv' {
  import * as React from 'react';

  export interface CSVLinkProps {
    data: object[] | string;
    headers?: { label: string; key: string }[];
    separator?: string;
    enclosingCharacter?: string;
    filename?: string;
    uFEFF?: boolean;
    target?: string;
    className?: string;
    style?: React.CSSProperties;
    id?: string;
    asyncOnClick?: boolean;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>, done: () => void) => void | boolean;
  }

  export const CSVLink: React.FC<React.PropsWithChildren<CSVLinkProps>>;
  export const CSVDownload: React.FC<React.PropsWithChildren<CSVLinkProps>>;
}
