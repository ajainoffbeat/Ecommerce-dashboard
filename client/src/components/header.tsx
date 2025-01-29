import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const { pathname } = location;

  // Split pathname into segments
  const pathSegments = pathname.split("/").filter((segment) => segment);

  // Generate breadcrumb items
  const breadcrumbs = pathSegments.map((segment, index) => {
    // Build the path for each breadcrumb
    const breadcrumbPath = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const isLast = index === pathSegments.length - 1;

    return isLast ? (
      <BreadcrumbPage key={breadcrumbPath} >
        {segment}
      </BreadcrumbPage>
    ) : (
      <BreadcrumbItem key={breadcrumbPath}>
        <BreadcrumbLink href={breadcrumbPath}>
          {segment}
        </BreadcrumbLink>
        <BreadcrumbSeparator />
      </BreadcrumbItem>
    );
  });

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="capitalize hidden md:inline">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" >Home</BreadcrumbLink>
              {breadcrumbs.length > 0 && <BreadcrumbSeparator />}
            </BreadcrumbItem>
            {breadcrumbs}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};

export default Header;

