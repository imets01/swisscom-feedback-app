"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import DetailDialog from "./detailDialog";

import { useState } from "react";
import { useEffect } from "react";
export default function FeedbackTable() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchFeedback(currentPage);
  }, [currentPage]);

  const fetchFeedback = async (page) => {
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(
        `${API_BASE_URL}/feedback?page=${page}&limit=${itemsPerPage}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }
      const data = await response.json();
      console.log(data);
      setFeedbackList(data.feedback);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (err) {
      console.error("Error fetching feedback: ", err);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className="flex justify-center items-cente">
      <div className=" mx-8 py-8">
        <h1 className="text-primary text-3xl font-bold mb-6">All feedbacks</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role Interviewed For</TableHead>
              <TableHead>Date of Interview</TableHead>
              <TableHead>Overall Experience Rating</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feedbackList.map((feedback) => (
              <TableRow key={feedback.id}>
                <TableCell>{feedback.full_name || "-"}</TableCell>
                <TableCell>{feedback.email || "-"}</TableCell>
                <TableCell>{feedback.role}</TableCell>
                <TableCell>
                  {new Date(feedback.interview_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{feedback.rating_experience}</TableCell>
                <TableCell>
                  <DetailDialog feedback={feedback} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="sticky bottom-0 py-5 flex justify-center">
          <div className="w-fit">
            <Pagination className="bg-card rounded-md p-1">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => handlePageChange(index + 1)}
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}
