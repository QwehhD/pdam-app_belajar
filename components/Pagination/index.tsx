"use Client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";


type Props = {
  count: number;
  perPage: number;
  currentPages: number;
};

export default function SimplePagination({ count, perPage, currentPages }: Props) {
    const totalPage = Math.ceil(count / perPage);
    const isFirstPage = currentPages === 1;
    const isLastPage = currentPages >= totalPage;
    
    const router = useRouter();
    const searchParams = useSearchParams() ;
 
    const changePage = (page:number) => {
        const safePage = Math.min(Math.max(page, 1), totalPage);
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', safePage.toString());
        router.push(`?${params.toString()}`);
    }

    const generatePages = () => {
        const pages = [];
        let start = Math.max(1, currentPages - 2, 1);
        let end = Math.min(currentPages + 2, totalPage);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
        
        

    console.log("count:", count);
    console.log("perPage:", perPage);
    console.log("currentPages:", currentPages);
    console.log("totalPage:", totalPage);

    return (
        <Pagination>
            <PaginationContent>
        {/* First Ellipsis*/}
        {currentPages > 3 && (
            <>
            <PaginationItem> 
             <PaginationLink onClick={() => changePage (1)}>
                1
                </PaginationLink>   
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                    </PaginationItem>           
            </>
        )}
        {/*Number Pages*/}
        {generatePages().map((page) => (
            <PaginationItem key={page}>
                <PaginationLink
                isActive={page === currentPages}
                onClick={() => changePage(page)}>
                    {page}
                </PaginationLink>
            </PaginationItem>
        ))}

        {/*Last Ellipis*/}
        {currentPages < totalPage - 2 && (
            <>
            <PaginationItem>
                <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink onClick={() => changePage(totalPage)}>
                    {totalPage}
                </PaginationLink>
            </PaginationItem>
            </>
        )}
        {/* Next */}
        <PaginationItem>
            <PaginationNext
            onClick={() => !isLastPage && changePage(currentPages + 1)}
            className={isLastPage ? "pointer-events-none opacity-50" : ""}
            />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
        )
    }
 }
