import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function FeedbackTable({ feedbackList }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Feedback List</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role Interviewed For</TableHead>
            <TableHead>Date of Interview</TableHead>
            <TableHead>Overall Experience Rating</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedbackList.map((feedback) => (
            <TableRow key={feedback.id}>
              <TableCell>{feedback.full_name || "Anonymous"}</TableCell>
              <TableCell>{feedback.role}</TableCell>
              <TableCell>
                {new Date(feedback.interview_date).toLocaleDateString()}
              </TableCell>
              <TableCell>{feedback.rating_experience}</TableCell>
              <TableCell>
                <detailDialog feedback={feedback} />

                <Button variant="outline" size="sm">
                  Mark as Reviewed
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
