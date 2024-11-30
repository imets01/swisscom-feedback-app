"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FeedbackTable from "./adminComponents/feedbackTable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AdminSidebar } from "./adminComponents/adminSidebar";
import DashboardPage from "../admin/dashboard/page";

export default function AdminDashboard() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 7;

  const router = useRouter();
  useEffect(() => {
    fetchFeedback(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const fetchFeedback = async (page) => {
    try {
      const response = await fetch(
        `http://localhost:5000/feedback?page=${page}&limit=${itemsPerPage}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }
      const data = await response.json();
      setFeedbackList(data.feedback);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (err) {
      console.error("Error fetching feedback:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("http://localhost:5000/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      const data = await response.json();

      setStats(data);
      console.log(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading || stats === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-12 py-8">
      <FeedbackTable feedbackList={feedbackList} />
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
  );
}
