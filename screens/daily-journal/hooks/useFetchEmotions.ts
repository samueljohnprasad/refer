import { useAtomValue } from "jotai";
import { calenderVisibleDatesAtom } from "../atoms";
import { supabase } from "@/lib/supabase";

const useFetchEmotions = () => {
  const calenderVisibleDates = useAtomValue(calenderVisibleDatesAtom);

//   const fetchEmotions = async () => {
//     const { data, error } = await supabase.from("emotions").select("*").eq("date", format(calenderVisibleDates.visibleStartDate, "yyyy-MM-dd"));
//     if (error) {
//       console.error("Error fetching emotions:", error);
//     }
//     return data;
//   };

};

export default useFetchEmotions;
