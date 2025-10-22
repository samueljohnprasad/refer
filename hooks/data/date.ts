import { format } from "date-fns/format";

export const formateDate_y_m_d = (date: Date | string) => {
  return format(date, "yyyy-MM-dd");
};
