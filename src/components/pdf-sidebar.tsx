"use client";

import { Document, Page, pdfjs } from "react-pdf";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarTrigger,
} from "@/components/ui/sidebar";

interface PDFSidebarProps {
    file: string | null;
    numPages: number;
    currentPage: number;
    onPageChange: (pageNumber: number) => void;
}

export function PDFSidebar({
    file,
    numPages,
    currentPage,
    onPageChange,
}: PDFSidebarProps) {
    if (!file) return null;

    return (
        <Sidebar className=" border-r border-[#253745]">
            <SidebarContent>
                <Document
                    file={file}
                    className="flex flex-col items-center gap-4 p-4"
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <button
                            key={`thumb_${index + 1}`}
                            onClick={() => onPageChange(index + 1)}
                            className={`w-full transition-colors ${
                                currentPage === index + 1
                                    ? "ring-2 ring-blue-500"
                                    : "hover:bg-[#253745]"
                            }`}
                        >
                            <Page
                                pageNumber={index + 1}
                                width={200}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                            />
                        </button>
                    ))}
                </Document>
            </SidebarContent>
        </Sidebar>
    );
}
