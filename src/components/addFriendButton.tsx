"use client";

import { FC, useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { z } from "zod";
import { addFriendValidator } from "@/lib/validations/client-vals";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { IconSpinner } from "./ui/icons";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast"


interface AddFriendButtonProps {}
type formValues = z.infer<typeof addFriendValidator>;

const AddFriendButton: FC<AddFriendButtonProps> = () => {
  const { toast } = useToast();
  const [isSendingRequest, setSendingRequest] = useState<boolean>(false);
  const { register, handleSubmit, setError } = useForm<formValues>({
    resolver: zodResolver(addFriendValidator),
  });

  const sendRequest = async (query: string) => {
    try {
      setSendingRequest(true)
      const validatedQuery = addFriendValidator.parse({ query });
      const res = await axios.post("/api/friend_request/send", {
        query: validatedQuery,
      });
      toast({
        title: res.data.msg,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("query", { message: error.message });
        toast({
          title: error.message,
        })
        return;
      }
      if (error instanceof AxiosError) {
        setError("query", { message: error.response?.data });
        toast({
          title: error.response?.data.error
        })
        return;
      }

      setError("query", { message: "Something went wrong." });
      toast({
        title: "Something went wrong."
      })

    } finally {
      setSendingRequest(false)
    }
  };

  const onSubmit = (data: formValues) => {
    sendRequest(data.query);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          //   onClick={handleClick}
          className="flex w-full justify-between rounded-md bg-background p-2 text-left text-xs text-gray-400 hover:text-accent-foreground hover:bg-background/70 border"
        >
          Add a Friend
          <div className="rounded-sm bg-gray-800/50 px-1 text-[11px]">
            Ctrl K
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Add Friend</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <Input
              {...register("query")}
              type="text"
              placeholder="Enter email or username"
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <div className="w-full flex justify-center">
              <Button
                className="gap-1"
                type="submit"
                disabled={isSendingRequest}
              >
                <span>{ isSendingRequest ? 'Sending Request' : 'Send Request' }</span>
                {isSendingRequest && <IconSpinner ></IconSpinner>}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendButton;
