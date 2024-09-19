import { createFile, uploadFile } from "@/firebase/services";
import { auth } from "@/firebase/init";
import { DocumentReference, serverTimestamp } from "firebase/firestore";
import { TaskState, UploadTask } from "firebase/storage";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type UploadOptions = {
  onSuccess?: (snapshot: DocumentReference) => void;
  onError?: (e: Error) => void;
};

export const useUpload = (
  file: File,
  { onSuccess, onError }: UploadOptions
) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error>();
  const [uploadState, setUploadState] = useState<TaskState>("paused");
  const [uploadTask, setUploadTask] = useState<UploadTask | undefined>();
  const { id } = useParams();

  const upload = useCallback(() => {
    setUploadState("running");
    setUploadTask(uploadFile(file));
  }, [file]);

  const handleSuccess = (uploadTask: UploadTask) => {
    //creates file in firestore on success
    createFile({
      parent: id as string,
      path: uploadTask.snapshot.ref.fullPath,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      user: auth.currentUser?.uid as string,
      type: "file",
      createdAt: serverTimestamp(),
    })
      .then((snapshot) => {
        if (onSuccess) onSuccess(snapshot);
        setUploadState("success");
      })
      .catch((e) => {
        if (onError) onError(e);
        setUploadState("error");
        setError(e);
      });
  };

  useEffect(() => {
    if (uploadTask) {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setProgress(snapshot.bytesTransferred / snapshot.totalBytes);
        },
        (error) => {
          setError(error);
          setUploadState("error");
          if (onError) onError(error);
        },
        () => handleSuccess(uploadTask)
      );
    }
  }, [uploadTask]);

  const pause = () => {
    if (uploadTask && uploadState == "running") {
      uploadTask.pause();
      setUploadState("paused");
    }
  };

  const resume = () => {
    if (uploadTask && uploadState == "paused") {
      uploadTask.resume();
      setUploadState("running");
    }
  };

  const cancel = () => {
    if (uploadTask && (uploadState == "running" || uploadState == "paused")) {
      uploadTask.cancel();
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
