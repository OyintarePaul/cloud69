import Link from "next/link";
import { Fragment } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { Crumb } from "@/lib/types";

/** Home / Work / Reports. The last item is the current folder (not a link). */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
    return (
        <Breadcrumb>
            <BreadcrumbList className="flex-nowrap overflow-x-auto whitespace-nowrap">
                <BreadcrumbItem className="shrink-0">
                    {crumbs.length === 0 ? (
                        <BreadcrumbPage>Home</BreadcrumbPage>
                    ) : (
                        <BreadcrumbLink render={<Link href="/folder/root" />}>
                            Home
                        </BreadcrumbLink>
                    )}
                </BreadcrumbItem>

                {crumbs.map((crumb, index) => {
                    const isLast = index === crumbs.length - 1;
                    return (
                        <Fragment key={crumb.id}>
                            <BreadcrumbSeparator className="shrink-0" />
                            <BreadcrumbItem className="shrink-0">
                                {isLast ? (
                                    <BreadcrumbPage>
                                        {crumb.name}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink
                                        render={
                                            <Link
                                                href={`/folder/${crumb.id}`}
                                            />
                                        }
                                    >
                                        {crumb.name}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
