"use client";
import React, { useEffect, useState } from "react";

const ResultsPage: React.FC = () => {
  const [collageUrl, setCollageUrl] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUrl = localStorage.getItem("collageImage") || "";
      setCollageUrl(storedUrl);
    }
  }, []);

  if (!collageUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No collage available.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
      <img
        src={collageUrl}
        alt="Generated Collage"
        className="max-h-screen h-100% w-100%"
      />
    </div>
  );
};

export default ResultsPage;
