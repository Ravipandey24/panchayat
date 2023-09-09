"use client";

import { cn } from "@/lib/utils";
import Textarea from "react-textarea-autosize";
import { Button, buttonVariants } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { IconMessage, IconSendMessage, IconPlus } from "../ui/icons";
import React, { useRef, useState } from "react";
import { messageValidator } from "@/lib/validations/client-vals";
import axios, { AxiosError } from "axios";
import { z } from "zod";


const InputSection = ({ chatData }: { chatData: Chat }) => {
  const [input, setInput] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const sendMessage = async () => {
    if (!input) return;
    setLoading(true);

    try {
      const payload = messageValidator.parse({
        conversationId: chatData.conversation._id,
        conversationType: chatData.type,
        senderId: chatData.currentUser._id,
        text: input,
      });

      await axios.post('/api/message/send', payload)
      textareaRef.current?.focus();
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error({ message: error.message });
        return;
      }

      if (error instanceof AxiosError) {
        console.error({ message: error.response?.data });
        return;
      }

      console.error("message", error);
    } finally {
      setLoading(false);
      setInput("");
    }
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              // onClick={e => {
              //   e.preventDefault()
              //   router.refresh()
              //   router.push('/')
              // }}
              className={cn(
                buttonVariants({ size: "sm", variant: "outline" }),
                "absolute left-0 top-4 h-8 w-8 rounded-full bg-background p-0 sm:left-4"
              )}
            >
              <IconPlus />
              <span className="sr-only">New Chat</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Textarea
        ref={textareaRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Send a message."
        spellCheck={false}
        className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
      />
      <div className="absolute right-0 top-4 sm:right-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || input === ""}
                onClick={sendMessage}
              >
                <IconSendMessage className="h-5 w-5" />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default InputSection;
