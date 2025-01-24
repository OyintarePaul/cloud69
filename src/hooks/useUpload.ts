import { uploadFile } from "@/firebase/services";
import { createResource } from "@/appwrite/services";

import { TaskState, UploadTask } from "firebase/storage";
import { useCallback, useRef, useState } from "react";
import { useParams } from "react-router";

import { useAuth } from "@/providers/auth";

type UploadOptions = {
  onSuccess?: () => void;
  onError?: (e: Error) => void;
};

export const useUpload = (
  file: File,
  { onSuccess, onError }: UploadOptions
) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error>();
  const [uploadState, setUploadState] = useState<TaskState>("paused");
  const { id: parentID } = useParams();
  const { user } = useAuth();
  const uploadTask = useRef<UploadTask>();

  const upload = useCallback(() => {
    setUploadState("running");
    uploadTask.current = uploadFile(file);
    uploadTask.current.on(
      "state_changed",
      (snapshot) => {
        setProgress(snapshot.bytesTransferred / snapshot.totalBytes);
      },
      (e) => {
        setError(e);
        setUploadState("error");
        if (onError) onError(e);
      },
      () => handleSuccess(uploadTask.current!)
    );
  }, [file]);

  const handleSuccess = (uploadTask: UploadTask) => {
    //creates file in firestore on success
    createResource({
      parentID: parentID as string,
      firebase_storage_path: uploadTask.snapshot.ref.fullPath,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      userID: user?.$id as string,
      type: "file",
    })
      .then(() => {
        if (onSuccess) onSuccess();
        setUploadState("success");
      })
      .catch((e) => {
        setError(e);
        setUploadState("error");
        if (onError) onError(e);
      });
  };

  const pause = () => {
    if (uploadTask && uploadState == "running") {
      uploadTask.current?.pause();
      setUploadState("paused");
    }
  };

  const resume = () => {
    if (uploadTask && uploadState == "paused") {
      uploadTask.current?.resume();
      setUploadState("running");
    }
  };

  const cancel = () => {
    if (uploadTask && (uploadState == "running" || uploadState == "paused")) {
      uploadTask.current?.cancel();
      setUploadState("canceled");
    }
  };

  return {
    progress,
    error,
    upload,
    uploadState,
    pause,
    resume,
    cancel,
  };
};
