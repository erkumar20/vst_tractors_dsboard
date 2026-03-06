import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Mail, Search, Send, CheckCircle2, XCircle, Clock } from "lucide-react";
import { emailData, type EmailData } from "../data/mockData";
import { toast } from "sonner";

export default function Email() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterItem, setFilterItem] = useState("all");
  const [showManualAlert, setShowManualAlert] = useState(false);
  const [showEmailDetail, setShowEmailDetail] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-300 gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Sent
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-300 gap-1">
            <XCircle className="w-3 h-3" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredEmails = emailData.filter((email) => {
    const matchesSearch =
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterItem === "all" || email.item === filterItem;
    return matchesSearch && matchesFilter;
  });

  const handleViewEmail = (email: EmailData) => {
    setSelectedEmail(email);
    setShowEmailDetail(true);
  };

  const handleResendEmail = (email: EmailData) => {
    toast.loading("Resending email...");
    setTimeout(() => {
      toast.dismiss();
      toast.success(`Email resent to ${email.recipient}`);
    }, 1000);
  };

  const handleSendManualAlert = () => {
    toast.loading("Sending manual alert...");
    setTimeout(() => {
      toast.dismiss();
      toast.success("Manual alert sent successfully!");
      setShowManualAlert(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Email</h1>
          <p className="text-gray-600 mt-1">Automated alerts and notifications sent</p>
        </div>
        <div className="flex justify-end lg:justify-start">
          <Button
            className="gap-2 bg-[#006847] hover:bg-[#005038] text-white"
            onClick={() => setShowManualAlert(true)}
          >
            <Send className="w-4 h-4" />
            Send Manual Alert
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 shadow-md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search emails by subject or recipient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterItem} onValueChange={setFilterItem}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by item" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="Item 1">Item 1</SelectItem>
              <SelectItem value="Item 2">Item 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Email List */}
      <Card className="shadow-md">
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <Mail className="w-5 h-5 text-gray-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sent Emails</h3>
            <p className="text-sm text-gray-600">Total: {filteredEmails.length} emails</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">Subject</TableHead>
                <TableHead className="font-semibold text-gray-700">Recipient</TableHead>
                <TableHead className="font-semibold text-gray-700">Item</TableHead>
                <TableHead className="font-semibold text-gray-700">Date & Time</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmails.map((email) => (
                <TableRow key={email.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900 max-w-md">
                    {email.subject}
                  </TableCell>
                  <TableCell className="text-gray-700">{email.recipient}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                      {email.item}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{email.date}</TableCell>
                  <TableCell>{getStatusBadge(email.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#006847] hover:text-[#005038]"
                        onClick={() => handleViewEmail(email)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => handleResendEmail(email)}
                      >
                        Resend
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Manual Alert Dialog */}
      <Dialog open={showManualAlert} onOpenChange={setShowManualAlert}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Send Manual Alert</DialogTitle>
            <DialogDescription>
              Compose and send a manual SOB alert to stakeholders.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="recipient">Recipient Email</Label>
              <Input id="recipient" placeholder="recipient@vsttractors.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Alert subject" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="item">Item</Label>
              <Select defaultValue="item1">
                <SelectTrigger id="item">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="item1">Item 1</SelectItem>
                  <SelectItem value="item2">Item 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Enter your message here..." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManualAlert(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#006847] hover:bg-[#005038]"
              onClick={handleSendManualAlert}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Detail Dialog */}
      <Dialog open={showEmailDetail} onOpenChange={setShowEmailDetail}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Email Details</DialogTitle>
            <DialogDescription>
              View complete email information
            </DialogDescription>
          </DialogHeader>
          {selectedEmail && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label className="font-semibold">Subject</Label>
                <p className="text-sm text-gray-700">{selectedEmail.subject}</p>
              </div>
              <div className="grid gap-2">
                <Label className="font-semibold">Recipient</Label>
                <p className="text-sm text-gray-700">{selectedEmail.recipient}</p>
              </div>
              <div className="grid gap-2">
                <Label className="font-semibold">Item</Label>
                <p className="text-sm text-gray-700">{selectedEmail.item}</p>
              </div>
              <div className="grid gap-2">
                <Label className="font-semibold">Date & Time</Label>
                <p className="text-sm text-gray-700">{selectedEmail.date}</p>
              </div>
              <div className="grid gap-2">
                <Label className="font-semibold">Status</Label>
                <div>{getStatusBadge(selectedEmail.status)}</div>
              </div>
              <div className="grid gap-2">
                <Label className="font-semibold">Message</Label>
                <div className="p-4 bg-gray-50 rounded-md text-sm text-gray-700">
                  This is an automated SOB alert regarding {selectedEmail.item}.
                  Please review the attached performance metrics and take necessary actions.
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDetail(false)}>
              Close
            </Button>
            <Button
              className="bg-[#006847] hover:bg-[#005038]"
              onClick={() => {
                if (selectedEmail) {
                  handleResendEmail(selectedEmail);
                  setShowEmailDetail(false);
                }
              }}
            >
              <Send className="w-4 h-4 mr-2" />
              Resend
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}