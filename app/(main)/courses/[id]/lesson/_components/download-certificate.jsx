"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
const DownloadCertificate = ({ courseId, progress }) => {
  const [isCertificateDownloading, setIsCertificateDownloading] =
    useState(false);
  const handleCerficateDownload = async (event) => {
    setIsCertificateDownloading(true);
    fetch(`/api/certificate?courseId=${courseId}`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Certificate.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      });

    toast.success("Certificate has been dowonloaded");
    try {
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsCertificateDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleCerficateDownload}
      disabled={progress < 100}
      className="mt-6 w-full px-4"
    >
      DownloadCertificate
    </Button>
  );
};

export default DownloadCertificate;
