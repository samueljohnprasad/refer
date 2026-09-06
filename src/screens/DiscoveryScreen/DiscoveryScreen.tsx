import React from "react";
import { DiscoveryView } from "./DiscoveryView";
import { useDiscoveryScreenViewModel } from "./hooks/useDiscoveryScreenViewModel";

// ponytail: thin container component connecting data/logic ViewModel to pure presentational DiscoveryView
function DiscoveryScreen() {
  const viewModel = useDiscoveryScreenViewModel();
  return <DiscoveryView {...viewModel} />;
}

export default React.memo(DiscoveryScreen);
