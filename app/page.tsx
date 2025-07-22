// 'use client';
// import ChatInput from "@/components/ChatInput";
// import ChatMessage from "@/components/ChatMessage";
// import ChatSideBar from "@/components/ChatSideBar";
// import { useEffect, useState } from "react";
// import { getFakeResponseStream } from "@/lib/fakeLLM";

// import { signOut } from '@aws-amplify/auth';
// import { Amplify } from 'aws-amplify';
// import outputs from '@/amplify_outputs.json';

// interface Message {
//   id: number;
//   sender: "user" | "bot";
//   text: string;
//   isStreaming?: boolean;
// }

// interface ChatSession {
//   id: string;
//   title: string;
//   messages: Message[];
// }

// const mockHistory: ChatSession[] = [
//   {
//     id: "1",
//     title: "Trip Planning",
//     messages: [
//       { id: 1, sender: "user", text: "Plan me a trip to Japan" },
//       { id: 2, sender: "bot", text: "Sure! Here's a 5-day itinerary for Japan." },
//     ],
//   },
//   {
//     id: "2",
//     title: "Resume Tips",
//     messages: [
//       { id: 3, sender: "user", text: "Can you improve my resume?" },
//       { id: 4, sender: "bot", text: "Absolutely! Let me give you some formatting advice." },
//     ],
//   },
// ];

// Amplify.configure(outputs)

// export default function ChatPage() {
//   const [sessions, setSessions] = useState<ChatSession[]>([]);
//   const [currentSessionId, setCurrentSessionId] = useState<string>("");
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [sidebarMode, setSidebarMode] = useState<"chat" | "files">("chat");

//   useEffect(() => {
//     setSessions(mockHistory);
//     setCurrentSessionId(mockHistory[0].id);
//     setMessages(mockHistory[0].messages);
//   }, []);

//   const handleSend = async (text: string) => {
//     const userMsg: Message = {
//       id: Date.now(),
//       sender: "user",
//       text,
//     };
//     setMessages((prev) => [...prev, userMsg]);

//     const botMsg: Message = {
//       id: Date.now() + 1,
//       sender: "bot",
//       text: "",
//       isStreaming: true,
//     };
//     setMessages((prev) => [...prev, botMsg]);

//     for await (const chunk of getFakeResponseStream(text)) {
//       setMessages((prev) => {
//         return prev.map((msg) =>
//           msg.id === botMsg.id ? { ...msg, text: msg.text + chunk } : msg
//         );
//       });
//     }

//     setMessages((prev) =>
//       prev.map((msg) =>
//         msg.id === botMsg.id ? { ...msg, isStreaming: false } : msg
//       )
//     );
//   };

//   const handleSelectSession = (id: string) => {
//     const session = sessions.find((s) => s.id === id);
//     if (!session) return;
//     setCurrentSessionId(id);
//     setMessages(session.messages);
//   };

//   // return (
//   //   <div className="flex h-screen">
//   //     <ChatSideBar
//   //       sessions={sessions}
//   //       currentId={currentSessionId}
//   //       onSelect={handleSelectSession}
//   //       sidebarMode={sidebarMode}
//   //       setSidebarMode={setSidebarMode}
//   //     />
//   //     <div className="flex flex-col flex-1 max-w-4xl mx-auto p-4">
//   //       <div className="flex-1 overflow-y-auto space-y-2">
//   //         {messages.map((msg) => (
//   //           <ChatMessage key={msg.id} sender={msg.sender} text={msg.text} isStreaming={msg.isStreaming} />
//   //         ))}
//   //       </div>
//   //       <ChatInput onSend={handleSend} />
//   //     </div>
//   //   </div>
//   // );
//   return (
//     <div className="flex h-screen">
//       <ChatSideBar
//         sessions={sessions}
//         currentId={currentSessionId}
//         onSelect={handleSelectSession}
//         sidebarMode={sidebarMode}
//         setSidebarMode={setSidebarMode}
//       />
//       <div className="flex flex-col flex-1 max-w-4xl mx-auto p-4">
//         {/* Sign-out button */}
//         <div className="flex justify-end mb-2">
//           <button
//             onClick={() => signOut()}
//             className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//           >
//             Sign Out
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto space-y-2">
//           {messages.map((msg) => (
//             <ChatMessage
//               key={msg.id}
//               sender={msg.sender}
//               text={msg.text}
//               isStreaming={msg.isStreaming}
//             />
//           ))}
//         </div>

//         <ChatInput onSend={handleSend} />
//       </div>
//     </div>
//   );
// }

'use client';
import ChatInput from "@/components/ChatInput";
import ChatMessage from "@/components/ChatMessage";
import ChatSideBar from "@/components/ChatSideBar";
import { useEffect, useState } from "react";
import { getFakeResponseStream } from "@/lib/fakeLLM";

import { signOut } from '@aws-amplify/auth';
import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';
import { useRouter } from "next/navigation";
import { useAuthStatus } from "@/hooks/use-auth";

Amplify.configure(outputs);

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  isStreaming?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

const mockHistory: ChatSession[] = [
  {
    id: "1",
    title: "Trip Planning",
    messages: [
      { id: 1, sender: "user", text: "Plan me a trip to Japan" },
      { id: 2, sender: "bot", text: "Sure! Here's a 5-day itinerary for Japan." },
    ],
  },
  {
    id: "2",
    title: "Resume Tips",
    messages: [
      { id: 3, sender: "user", text: "Can you improve my resume?" },
      { id: 4, sender: "bot", text: "Absolutely! Let me give you some formatting advice." },
    ],
  },
];

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarMode, setSidebarMode] = useState<"chat" | "files">("chat");

  const { isLoading, isAuthenticated } = useAuthStatus();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    setSessions(mockHistory);
    setCurrentSessionId(mockHistory[0].id);
    setMessages(mockHistory[0].messages);
  }, []);

  const handleSend = async (text: string) => {
    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text,
    };
    setMessages((prev) => [...prev, userMsg]);

    const botMsg: Message = {
      id: Date.now() + 1,
      sender: "bot",
      text: "",
      isStreaming: true,
    };
    setMessages((prev) => [...prev, botMsg]);

    for await (const chunk of getFakeResponseStream(text)) {
      setMessages((prev) => {
        return prev.map((msg) =>
          msg.id === botMsg.id ? { ...msg, text: msg.text + chunk } : msg
        );
      });
    }

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === botMsg.id ? { ...msg, isStreaming: false } : msg
      )
    );
  };

  const handleSelectSession = (id: string) => {
    const session = sessions.find((s) => s.id === id);
    if (!session) return;
    setCurrentSessionId(id);
    setMessages(session.messages);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <ChatSideBar
        sessions={sessions}
        currentId={currentSessionId}
        onSelect={handleSelectSession}
        sidebarMode={sidebarMode}
        setSidebarMode={setSidebarMode}
      />
      <div className="flex flex-col flex-1 max-w-4xl mx-auto p-4">
        {/* Sign-out button if logged in */}
        <div className="flex justify-end mb-2">
          {isAuthenticated && (
            <button
              onClick={() => signOut().then(() => router.push("/login"))}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              sender={msg.sender}
              text={msg.text}
              isStreaming={msg.isStreaming}
            />
          ))}
        </div>

        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
