"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { notify } from "@/lib/helpers";
import { useAppStore } from "@/lib/store";
import {
  ArrowLeft,
  Send,
  Image as ImageIcon,
  Copy,
  Check,
  Users,
  MoreVertical,
  Smile,
  Bot,
} from "lucide-react";

// Mock chatroom data
const mockChatrooms = {
  1: { name: "General", description: "Main discussion room", memberCount: 45 },
  2: { name: "Tech Talk", description: "Latest tech trends", memberCount: 23 },
  3: { name: "Random", description: "Casual conversations", memberCount: 31 },
  4: {
    name: "Dev Chat",
    description: "Development discussions and help",
    memberCount: 67,
  },
};

// Generate mock messages with extended conversation
const generateMockMessages = (count = 50) => {
  const messages = [];
  const now = new Date();

  // Extended user messages for more realistic conversation
  const userMessages = [
    "Hey everyone! How's it going?",
    "Just finished working on a new project 🎉",
    "Anyone tried the new Next.js features?",
    "This chat interface looks really nice!",
    "Working late tonight, anyone else?",
    "Love the Material 3 design here",
    "Quick question about React hooks",
    "Thanks for the help yesterday!",
    "The squircle cards look amazing",
    "Having a great day so far!",
    "Can someone help me with this TypeScript error?",
    "What's your favorite VS Code extension?",
    "Just deployed my app to Vercel!",
    "Anyone using Tailwind CSS? Thoughts?",
    "Breaking: new React version is out!",
    "Coffee break time ☕",
    "This Material 3 theming is so clean",
    "Working on a cool animation today",
    "Does anyone know a good UI library?",
    "Just discovered shadcn/ui, it's amazing!",
    "What do you think about this design?",
    "Need some feedback on my portfolio",
    "Anyone up for a code review?",
    "Just finished debugging that issue 🐛",
    "What's everyone working on?",
    "This new feature is looking great",
    "Anyone tried the new GitHub Copilot updates?",
    "Just learned something cool about CSS Grid",
    "Weekend coding session planned!",
    "What's your go-to tech stack?",
    "This project is coming together nicely",
    "Anyone good with database design?",
    "Just found an awesome tutorial",
    "What are your thoughts on this approach?",
    "Time for lunch break 🍕",
    "This component is so reusable",
    "Anyone know good resources for learning?",
    "Just pushed my latest changes",
    "What's the best way to handle this?",
    "This optimization improved performance by 50%!",
    "Anyone else excited about this new tech?",
    "Just solved a tricky algorithm problem",
    "What's your coding music today?",
    "This design system is so consistent",
    "Anyone using Docker for development?",
    "Just integrated a cool API",
    "What's your favorite debugging tool?",
    "This refactoring made the code so clean",
    "Anyone attending the conference next week?",
    "Just learned about this design pattern",
  ];

  // Extended Gemini responses for more realistic AI conversation
  const geminiMessages = [
    "Hello! I'm Gemini, your AI assistant. How can I help you today?",
    "That's an interesting question! Let me think about that for a moment.",
    "Based on what you've shared, I'd recommend exploring the latest React patterns.",
    "The Material 3 design system really does create beautiful interfaces!",
    "I'm here to help with any coding questions you might have.",
    "Great point! The squircle shapes add a nice touch to the UI.",
    "Working on projects can be really rewarding. What are you building?",
    "React hooks are powerful tools for state management and side effects.",
    "I'm glad I could help! Feel free to ask if you have more questions.",
    "The development experience looks smooth with this setup!",
    "For TypeScript errors, I'd suggest checking your type definitions first.",
    "VS Code has some great extensions! I'd recommend GitLens and Prettier.",
    "Congratulations on the deployment! Vercel is an excellent choice.",
    "Tailwind CSS is fantastic for rapid prototyping and consistent styling.",
    "New React versions often bring performance improvements and better DX.",
    "Coffee is essential for good code! ☕ What's your favorite blend?",
    "Material 3 really does provide a clean, modern aesthetic.",
    "Animations can really enhance user experience when done thoughtfully.",
    "For UI libraries, I'd suggest looking at Chakra UI, Mantine, or Ant Design.",
    "shadcn/ui is indeed excellent! Great TypeScript support and customization.",
    "I'd be happy to provide feedback on your design. What specific areas?",
    "Portfolio feedback sounds great! Consider showcasing your problem-solving process.",
    "Code reviews are valuable for learning and improving code quality.",
    "Debugging victories are always satisfying! What was the root cause?",
    "I love hearing about new projects! What technologies are you using?",
    "New features are exciting! How are you planning to test it?",
    "GitHub Copilot keeps getting better with each update!",
    "CSS Grid is incredibly powerful for complex layouts.",
    "Weekend coding is the best! What project will you be working on?",
    "Tech stacks depend on the project, but React/Next.js is always solid.",
    "It's great when projects start coming together! What's next?",
    "Database design is crucial! Are you working with SQL or NoSQL?",
    "Good tutorials are gold! Mind sharing the link?",
    "I'd be happy to discuss different approaches. What's the context?",
    "Lunch breaks are important for productivity! 🍕",
    "Reusable components are the key to maintainable code.",
    "For learning resources, I'd recommend MDN, freeCodeCamp, and official docs.",
    "Version control is essential! How's your Git workflow?",
    "Context would help me suggest the best approach for your situation.",
    "50% performance improvement is impressive! What optimization did you make?",
    "New technologies can be exciting! What caught your attention?",
    "Algorithm problems are great for improving problem-solving skills!",
    "Good coding music can really help with focus. Any recommendations?",
    "Consistent design systems make development so much smoother.",
    "Docker is excellent for development consistency across environments.",
    "API integrations can be tricky but rewarding when they work smoothly.",
    "For debugging, browser DevTools and console.log are my go-to tools.",
    "Clean code after refactoring is so satisfying! What patterns did you use?",
    "Conferences are great for learning and networking! Which one?",
    "Design patterns can really improve code architecture. Which one interests you?",
  ];

  for (let i = count; i >= 1; i--) {
    const isUser = Math.random() > 0.4; // More balanced conversation
    const timestamp = new Date(now.getTime() - i * 180000); // 3 min intervals for more activity

    if (isUser) {
      messages.push({
        id: `msg-${count - i + 1}`,
        content: userMessages[Math.floor(Math.random() * userMessages.length)],
        sender: {
          id: "user-1",
          name: "You",
          avatar: null,
          isCurrentUser: true,
        },
        timestamp,
        type: "text",
      });
    } else {
      messages.push({
        id: `msg-${count - i + 1}`,
        content:
          geminiMessages[Math.floor(Math.random() * geminiMessages.length)],
        sender: {
          id: "gemini",
          name: "Gemini",
          avatar: "bot-icon",
          isCurrentUser: false,
        },
        timestamp,
        type: "text",
      });
    }

    // Occasionally add image messages (5% chance)
    if (Math.random() < 0.05 && isUser) {
      messages.push({
        id: `img-${count - i + 1}`,
        content: "Check out this cool design!",
        sender: {
          id: "user-1",
          name: "You",
          avatar: null,
          isCurrentUser: true,
        },
        timestamp: new Date(timestamp.getTime() + 30000),
        type: "image",
        image: `https://picsum.photos/400/300?random=${count - i + 1}`,
      });
    }
  }

  return messages.sort((a, b) => a.timestamp - b.timestamp);
};

export default function ChatroomPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAppStore();
  const [chatroom, setChatroom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [geminiTyping, setGeminiTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const loadMoreRef = useRef(null);
  const allMessagesRef = useRef([]);
  const [page, setPage] = useState(1);
  const MESSAGES_PER_PAGE = 20;

  // Initialize chatroom and messages
  useEffect(() => {
    const roomData = mockChatrooms[params.id];
    if (roomData) {
      setChatroom(roomData);
      // Generate 100 messages for Dev Chat (room 4), 50 for others
      const messageCount = params.id === "4" ? 100 : 50;
      const allMessages = generateMockMessages(messageCount);

      // Store all messages in ref for consistent pagination
      allMessagesRef.current = allMessages;

      // Set initial messages (last page)
      const initialMessages = allMessages.slice(-MESSAGES_PER_PAGE);
      setMessages(initialMessages);

      // Check if there are more messages to load
      setHasMoreMessages(allMessages.length > MESSAGES_PER_PAGE);

      // Reset pagination
      setPage(1);

      // Auto-scroll to bottom on first load
      setTimeout(() => {
        setShouldScrollToBottom(true);
      }, 100);
    }
  }, [params.id]);

  // Auto-scroll to bottom only for new messages, not when loading older ones
  const scrollToBottom = useCallback(() => {
    // Always scroll if we're not loading older messages and should force scroll
    if (!isLoadingOlder) {
      if (shouldScrollToBottom) {
        // Force scroll for new messages
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setShouldScrollToBottom(false);
      } else {
        // Check if user was near bottom for other message updates
        const container = messagesContainerRef.current;
        if (container) {
          const isScrolledToBottom =
            container.scrollHeight - container.clientHeight <=
            container.scrollTop + 50;
          // Only auto-scroll if user was already near the bottom
          if (isScrolledToBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    }
  }, [isLoadingOlder, shouldScrollToBottom]);

  // Load more messages (reverse infinite scroll)
  const loadMoreMessages = useCallback(async () => {
    if (loading || !hasMoreMessages || isLoadingOlder) return;

    setLoading(true);
    setIsLoadingOlder(true);

    // Store current scroll position
    const container = messagesContainerRef.current;
    const scrollHeightBefore = container?.scrollHeight || 0;
    const scrollTopBefore = container?.scrollTop || 0;

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Use consistent all messages from ref
    const allMessages = allMessagesRef.current;
    const startIndex = Math.max(
      0,
      allMessages.length - (page + 1) * MESSAGES_PER_PAGE
    );
    const endIndex = allMessages.length - page * MESSAGES_PER_PAGE;
    const olderMessages = allMessages.slice(startIndex, endIndex);

    if (olderMessages.length > 0) {
      setMessages((prev) => [...olderMessages, ...prev]);
      setPage((prev) => prev + 1);

      // Restore scroll position to maintain user's exact view position
      requestAnimationFrame(() => {
        if (container) {
          const scrollHeightAfter = container.scrollHeight;
          const scrollHeightDiff = scrollHeightAfter - scrollHeightBefore;
          // Keep the user at the same visual position
          container.scrollTop = scrollHeightDiff + scrollTopBefore;
        }
        // Reset loading state after position is properly restored
        setTimeout(() => {
          setIsLoadingOlder(false);
        }, 200);
      });
    } else {
      setHasMoreMessages(false);
      setIsLoadingOlder(false);
    }

    setLoading(false);
  }, [loading, hasMoreMessages, page, isLoadingOlder]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Intersection observer for auto-loading more messages
  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;
    if (!loadMoreElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          hasMoreMessages &&
          !loading &&
          !isLoadingOlder
        ) {
          loadMoreMessages();
        }
      },
      {
        root: messagesContainerRef.current,
        rootMargin: "50px",
        threshold: 0.1,
      }
    );

    observer.observe(loadMoreElement);

    return () => {
      if (loadMoreElement) {
        observer.unobserve(loadMoreElement);
      }
    };
  }, [hasMoreMessages, loading, isLoadingOlder, loadMoreMessages]);

  // Handle loading more messages via button click
  const handleLoadMore = () => {
    if (!loading && hasMoreMessages && !isLoadingOlder) {
      loadMoreMessages();
    }
  };

  // Simulate Gemini AI response
  const simulateGeminiResponse = useCallback(async (userMessage) => {
    setGeminiTyping(true);

    // Add typing indicator message
    const typingMessageId = `typing-${Date.now()}`;
    const typingMessage = {
      id: typingMessageId,
      content: "Gemini is typing...",
      sender: {
        id: "gemini",
        name: "Gemini",
        avatar: "bot-icon",
        isCurrentUser: false,
      },
      timestamp: new Date(),
      type: "typing",
    };

    setMessages((prev) => [...prev, typingMessage]);
    setShouldScrollToBottom(true); // Force scroll for typing indicator

    // Simulate thinking delay (1-3 seconds)
    const thinkingDelay = Math.random() * 2000 + 1000;
    await new Promise((resolve) => setTimeout(resolve, thinkingDelay));

    const responses = [
      "That's a great question! Let me help you with that.",
      "I understand what you're looking for. Here's my thoughts on that topic.",
      "Interesting point! I'd approach this from a few different angles.",
      "Thanks for sharing that. I can definitely provide some insights.",
      "That's a common challenge. Here's what I'd recommend.",
      "Great observation! Let me expand on that idea.",
      "I see what you mean. That's definitely worth exploring further.",
      "That makes sense! Here's how I'd tackle that problem.",
      "Excellent question! Let me break this down for you.",
      "I appreciate you bringing that up. Here's my perspective.",
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];

    const geminiMessage = {
      id: `msg-${Date.now()}`,
      content: response,
      sender: {
        id: "gemini",
        name: "Gemini",
        avatar: "bot-icon",
        isCurrentUser: false,
      },
      timestamp: new Date(),
      type: "text",
    };

    // Replace typing message with actual response
    setMessages((prev) =>
      prev.map((msg) => (msg.id === typingMessageId ? geminiMessage : msg))
    );
    setShouldScrollToBottom(true); // Force scroll for AI response
    setGeminiTyping(false);
  }, []);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedImage) return;

    const messageContent = newMessage.trim();
    setNewMessage("");

    // Create user message
    const userMessage = {
      id: `msg-${Date.now()}`,
      content: messageContent,
      sender: {
        id: user?.id || "user-1",
        name: user?.firstName || "You",
        avatar: user?.avatar || null,
        isCurrentUser: true,
      },
      timestamp: new Date(),
      type: selectedImage ? "image" : "text",
      image: selectedImage ? imagePreview : null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setShouldScrollToBottom(true); // Force scroll for new message

    // Clear image selection
    setSelectedImage(null);
    setImagePreview(null);

    // Trigger Gemini response with throttling
    if (messageContent) {
      setTimeout(() => {
        simulateGeminiResponse(messageContent);
      }, 500);
    }
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        notify.error("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Copy message to clipboard
  const copyToClipboard = async (content, messageId) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      notify.success("Message copied to clipboard!");
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      notify.error("Failed to copy message");
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now - messageTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return messageTime.toLocaleDateString();
  };

  if (!chatroom) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Chatroom not found</h2>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-surface">
      {/* Header */}
      <Card className="rounded-none border-b border-outline-variant/20 shadow-elevation-0">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <CardTitle className="text-lg">{chatroom.name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                  <Users className="h-4 w-4" />
                  {chatroom.memberCount} members
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          height: "100%",
          overflowY: "auto",
          scrollBehavior: "auto",
        }}
      >
        {/* Load More Button */}
        {hasMoreMessages && (
          <div ref={loadMoreRef} className="text-center py-2">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={loading || isLoadingOlder}
              className="rounded-full"
            >
              {loading || isLoadingOlder ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent mr-2"></div>
                  Loading older messages...
                </>
              ) : (
                "Load older messages"
              )}
            </Button>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 group ${
              message.sender.isCurrentUser ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              {message.sender.avatar === "bot-icon" ? (
                <AvatarFallback className="bg-blue-100">
                  <Bot className="h-4 w-4 text-blue-600" />
                </AvatarFallback>
              ) : message.sender.avatar ? (
                <AvatarImage src={message.sender.avatar} />
              ) : (
                <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
              )}
            </Avatar>

            <div
              className={`flex flex-col max-w-[70%] ${
                message.sender.isCurrentUser ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-on-surface-variant">
                  {message.sender.name}
                </span>
                <span className="text-xs text-on-surface-variant opacity-60">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>

              <div className="relative group">
                <Card
                  className={`max-w-none ${
                    message.sender.isCurrentUser
                      ? "bg-primary text-on-primary"
                      : message.type === "typing"
                      ? "bg-surface-container-high text-on-surface animate-pulse"
                      : "bg-surface-container text-on-surface"
                  }`}
                  style={{
                    backgroundColor: message.sender.isCurrentUser
                      ? "hsl(var(--primary))"
                      : message.type === "typing"
                      ? "hsl(var(--surface-container-high))"
                      : "hsl(var(--surface-container))",
                    color: message.sender.isCurrentUser
                      ? "hsl(var(--on-primary))"
                      : "hsl(var(--on-surface))",
                  }}
                >
                  <CardContent className="p-3">
                    {message.type === "image" && message.image && (
                      <div className="mb-2">
                        <Image
                          src={message.image}
                          alt="Uploaded image"
                          width={300}
                          height={200}
                          className="max-w-full h-auto rounded-2xl max-h-64 object-cover"
                        />
                      </div>
                    )}
                    {message.type === "typing" ? (
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                        <span className="text-sm text-current opacity-70">
                          {message.content}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Copy button - hide for typing messages */}
                {message.type !== "typing" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute -top-2 ${
                      message.sender.isCurrentUser ? "-left-10" : "-right-10"
                    } opacity-0 group-hover:opacity-100 transition-opacity rounded-full h-8 w-8`}
                    onClick={() => copyToClipboard(message.content, message.id)}
                  >
                    {copiedMessageId === message.id ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="p-4 border-t border-outline-variant/20">
          <div className="relative inline-block">
            <Image
              src={imagePreview}
              alt="Preview"
              width={80}
              height={80}
              className="max-h-20 rounded-2xl object-cover"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-surface shadow-elevation-2"
              onClick={() => {
                setSelectedImage(null);
                setImagePreview(null);
              }}
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <Card className="rounded-none border-t border-outline-variant/20 shadow-elevation-0">
        <CardContent className="p-4">
          <div className="flex items-end gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full flex-shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-5 w-5" />
            </Button>

            <div className="flex-1">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="min-h-[44px] resize-none"
                disabled={geminiTyping}
              />
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={(!newMessage.trim() && !selectedImage) || geminiTyping}
              className="rounded-full flex-shrink-0"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}
