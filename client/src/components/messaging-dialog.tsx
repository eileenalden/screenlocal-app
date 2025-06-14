/*
 * © Eileen Alden, 2025
 * All rights reserved.
 */

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Resource } from "@shared/schema";

interface MessagingDialogProps {
  resource: Resource;
  senderId: number;
}

export default function MessagingDialog({ resource, senderId }: MessagingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async ({ subject, content }: { subject: string; content: string }) => {
      const response = await apiRequest('POST', '/api/messages', {
        senderId,
        recipientId: resource.providerId,
        resourceId: resource.id,
        subject,
        content,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully",
      });
      setIsOpen(false);
      setSubject("");
      setContent("");
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "Please try again or contact support",
        variant: "destructive",
      });
    }
  });

  const handleSend = () => {
    if (!subject.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both subject and message content",
        variant: "destructive",
      });
      return;
    }

    sendMessageMutation.mutate({ subject, content });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <MessageSquare className="h-4 w-4 mr-2" />
          Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {resource.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Inquiry about your resource"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="content">Message</Label>
            <Textarea
              id="content"
              placeholder="Describe your project and what you need..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={sendMessageMutation.isPending}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}