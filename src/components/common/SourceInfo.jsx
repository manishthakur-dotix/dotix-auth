import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

const SourceInfo = ({ name, email, phone, source }) => {
  return (
    <>
      <Dialog>
        <DialogTrigger className="text-blue-500 font-medium">
          {name}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-gray-800 text-lg">
              Source Info
            </DialogTitle>
            <DialogDescription>
              <div className="mt-4">
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  <a href={`mailto: ${email}`} className="text-[#3d87ff]">
                    {" "}
                    {email}{" "}
                  </a>
                </p>
                <p className="mt-1">
                  <span className="font-medium">Phone:</span> {phone}{" "}
                </p>
              </div>
              <p className="mt-4">
                {" "}
                After signing in, you&apos;ll be redirected to:{" "}
                <span>
                  https://
                  {source}
                </span>
              </p>

              <div className="flex items-center justify-end mt-4">
                <DialogClose>
                  <Button variant="ghost">Got it</Button>
                </DialogClose>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SourceInfo;
