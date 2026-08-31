with open("src/domains/journey/ui/hooks/useJourneyNodeCellViewModel.ts", "r") as f:
    content = f.read()

# I already ran fix_node.py in the previous step, let's verify if the file has darkenHex or if it was removed
if 'darkenHex' in content:
    print("darkenHex still there")
else:
    print("darkenHex removed successfully")
