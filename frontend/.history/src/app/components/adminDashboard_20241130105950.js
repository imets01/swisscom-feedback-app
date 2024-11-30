﻿"use client";
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
    <div className="container mx-auto py-10">
      <Sidebar>
        <SidebarHeader className="flex items-center px-4 py-2">
          <Link href="/admin" className="flex items-center">
            <LayoutDashboard className="h-6 w-6 mr-2" />
            <span className="text-lg font-semibold">Admin Panel</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <SidebarNav>
              <SidebarNavItem href="/admin" active={pathname === "/admin"}>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </SidebarNavItem>
              <SidebarNavItem
                href="/admin/feedbacks"
                active={pathname === "/admin/feedbacks"}
              >
                <FileText className="h-4 w-4 mr-2" />
                Feedbacks
              </SidebarNavItem>
              <SidebarNavItem
                href="/admin/settings"
                active={pathname === "/admin/settings"}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </SidebarNavItem>
            </SidebarNav>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter>
          <Button variant="ghost" className="w-full justify-start" asChild>
            <Link href="/api/auth/signout">
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <Button onClick={handleSignOut}>Log Out</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Feedbacks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total_feedbacks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.average_rating} / 5</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Most Common Role</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">{stats.most_common_role}</p>
          </CardContent>
        </Card>
      </div>
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