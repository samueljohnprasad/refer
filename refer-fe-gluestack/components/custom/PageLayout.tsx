import { Box } from "../ui/box";
import SideNav from "./SideNav";

type PageLayoutProps = {
  children: React.ReactNode;
  title?: string;
  rightPanel: React.ReactNode;
  header: React.ReactNode;
};

const PageLayout = ({
  children,
  title = "ReferNet",
  rightPanel,
  header,
}: PageLayoutProps) => {
  return (
    <Box className="w-full h-full">
      <Box className="lg:w-[1200px] w-full min-h-screen mx-auto flex font-body flex-row  ">
        <Box className="w-[212px] flex-col flex-shrink-0 fixed pb-2 lg:flex justify-between hidden z-50">
          <SideNav />
        </Box>
        <Box className="w-full lg:pl-[212px] border-primaryBorder flex flex-row border-r border-primaryBorder pointer-events-none">
          <Box className="lg:w-[640px] w-full h-full pt-14 pb-20 lg:border-r lg:border-l box-border pointer-events-auto">
            <Box className=" z-50 h-14 lg:max-w-[638px] lg:w-[638px] fixed top-0 bg-gray-00 lg:left-auto lg:right-auto items-center hidden lg:flex justify-center left-12 right-12 ">
              <Box className="w-full h-full bg-green-100">
                <Box className="w-full h-full border-b border-primaryBorder px-2 py-4 sm:px-6 ">
                  {header}
                </Box>
              </Box>
            </Box>

            <Box className="w-full h-full z-10">{children} </Box>
          </Box>
          <Box className="relative pointer-events-auto">
            <Box className="h-14 lg:w-[349px] w-full z-50 lg:border-b border-primaryBorder fixed top-0 bg-gray-00 lg:px-6 flex-shrink-0">
              <Box className="flex items-center justify-between w-full lg:px-0 px-4 py-3">
                search bar
              </Box>
            </Box>
            <Box className="lg:w-[349px] float-right flex-shrink-0 bg-gray-00">
              <Box className="lg:w-[349px] max-w-348 bg-gray-00 duration-200 h-full min-h-screen fixed top-14 px-6 py-6 translate-x-full lg:block lg:translate-x-0 right-0 lg:right-auto overflow-y-auto hide-scrollbar pb-24">
                {rightPanel}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PageLayout;
