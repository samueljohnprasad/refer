import React from "react";

export interface ScreenRevealProps {
  children: React.ReactNode;
}

export const ScreenRevealView = React.memo(function ScreenRevealView({
  children,
}: ScreenRevealProps): React.JSX.Element {
  return <>{children}</>;
});

export function ScreenReveal(props: ScreenRevealProps): React.JSX.Element {
  return <ScreenRevealView {...props} />;
}
