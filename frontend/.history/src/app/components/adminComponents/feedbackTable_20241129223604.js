import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeedbackTable({ feedbackList }) {
  const [selectedFeedback, setSelectedFeedback] = useState(null);

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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mr-2"
                      onClick={() => setSelectedFeedback(feedback)}
                    >
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                      <DialogTitle>Feedback Details</DialogTitle>
                      <DialogDescription>
                        Detailed information about the feedback
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                      {selectedFeedback && (
                        <div className="space-y-6">
                          <Card>
                            <CardHeader>
                              <CardTitle>Personal Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-10">
                                <div>
                                  <h4 className="font-medium">Name</h4>
                                  <p>{selectedFeedback.full_name || "-"}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Email</h4>
                                  <p>{selectedFeedback.email || "-"}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Phone</h4>
                                  <p>{selectedFeedback.phone || "-"}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">
                                    Contact Permission
                                  </h4>
                                  <p>
                                    {selectedFeedback.contact_permission
                                      ? "Allowed"
                                      : "Not Allowed"}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle>Interview Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-10">
                                <div>
                                  <h4 className="font-medium">
                                    Date of Interview
                                  </h4>
                                  <p>
                                    {new Date(
                                      selectedFeedback.interview_date
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Role</h4>
                                  <p>{selectedFeedback.role}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">
                                    Interview Type
                                  </h4>
                                  <p>{selectedFeedback.interview_type}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">
                                    Interview Mode
                                  </h4>
                                  <p>{selectedFeedback.interview_mode}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle>Ratings</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-10">
                                <div>
                                  <h4 className="font-medium">
                                    Overall Experience
                                  </h4>
                                  <p>{selectedFeedback.rating_experience}/5</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">
                                    Professionalism of Interviewer
                                  </h4>
                                  <p>
                                    {selectedFeedback.rating_professionalism}
                                    /5
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Difficulty</h4>
                                  <p>{selectedFeedback.difficulty}/5</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle>Feedback</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium">
                                    What the Candidate Liked
                                  </h4>
                                  <p>{selectedFeedback.liked || "-"}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">
                                    What Could Be Improved
                                  </h4>
                                  <p>{selectedFeedback.improved || "-"}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle>Additional Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-10">
                                <div>
                                  <h4 className="font-medium">
                                    Clear Description of the Role
                                  </h4>
                                  <p>
                                    {selectedFeedback.description_clear
                                      ? "Yes"
                                      : "No"}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium">
                                    Would Recommend This Job
                                  </h4>
                                  <p>
                                    {selectedFeedback.suggestions
                                      ? "Yes"
                                      : "No"}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium">
                                    How They Heard About the Opportunity
                                  </h4>
                                  <p>{selectedFeedback.heard_about || "-"}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
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
