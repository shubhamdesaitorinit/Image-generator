"use client";
import Image from "next/image";
import { FormEvent, useCallback, useState } from "react";

function LoadingSpinner() {
  return (
    <div
      style={{
        border: "4px solid #ccc",
        borderTop: "4px solid #333",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        animation: "spin 1s linear infinite",
      }}
    />
  );
}

export default function Home() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    setInput(e.currentTarget.value);
  };

  const handleClick = useCallback(async () => {
    setError(null);
    setImageUrl(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://pro-image.desai99150.workers.dev/image-ai?prompt=${input}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: input }),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = (await response.json()) as { dataURI: string };
      setImageUrl(data.dataURI || "");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        gap: "1rem",
        fontFamily: "sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: "1rem" }}>Image Generator</h1>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          minHeight: "300px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1rem",
          backgroundColor: "#f9f9f9",
        }}
      >
        {input && (
          <div
            style={{
              alignSelf: "flex-start",
              backgroundColor: "gray",
              borderRadius: "8px",
              padding: "0.8rem",
              maxWidth: "80%",
            }}
          >
            <strong>Prompt:</strong> {input}
          </div>
        )}

        {isLoading && (
          <div
            style={{
              alignSelf: "flex-end",
              backgroundColor: "gray",
              borderRadius: "8px",
              padding: "0.8rem",
              maxWidth: "80%",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <strong>AI is generating your image...</strong>
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div
            style={{
              alignSelf: "flex-end",
              backgroundColor: "gray",
              borderRadius: "8px",
              padding: "0.8rem",
              maxWidth: "80%",
              color: "#a00",
            }}
          >
            <strong>Error: </strong>
            {error}
          </div>
        )}

        {imageUrl && !isLoading && (
          <div
            style={{
              alignSelf: "flex-end",
              backgroundColor: "gray",
              borderRadius: "8px",
              padding: "0.8rem",
              maxWidth: "80%",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <strong>AI Response:</strong>
            <Image
              src={imageUrl}
              alt="Generated"
              style={{ maxWidth: "100%", borderRadius: "8px" }}
            />
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "2rem",
          width: "100%",
        }}
      >
        <input
          type="text"
          onInput={handleInput}
          value={input}
          placeholder="Enter your prompt here..."
          style={{
            flexGrow: 1,
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleClick}
          disabled={!input.trim() || isLoading}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            border: "none",
            backgroundColor: !input.trim() || isLoading ? "#999" : "#0070f3",
            color: "#fff",
            cursor: !input.trim() || isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}
