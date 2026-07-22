import React from "react";

export interface RevealTopBarProps {
  children: React.ReactNode;
}

export const RevealTopBarView = React.memo(function RevealTopBarView({
  children,
}: RevealTopBarProps): React.JSX.Element {
  return <>{children}</>;
});

export function RevealTopBar(props: RevealTopBarProps): React.JSX.Element {
  return <RevealTopBarView {...props} />;
}
