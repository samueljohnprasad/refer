import React, { lazy } from "react";
import SuspensLoader from "@/src/components/SuspensLoader";
const PaywallScreen = lazy(
  () => import("@/src/screens/PaywallScreen/PaywallScreen")
);
const paywall = () => {
  return (
    <SuspensLoader>
      <PaywallScreen />
    </SuspensLoader>
  );
};

export default paywall;
