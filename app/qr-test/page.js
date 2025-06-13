"use client";
import { useState } from "react";
import QRScanner from "@/components/QRScanner";

export default function QRTestPage() {
  const [show, setShow] = useState(false);

  return (
    <div className="p-10">
      <button
        className="px-4 py-2 bg-indigo-600 text-white rounded"
        onClick={() => setShow(true)}
      >
        Open Scanner
      </button>
      {show && (
        <QRScanner
          onScan={(text) => {
            alert("Scanned: " + text);
            setShow(false);
          }}
          onClose={() => setShow(false)}
        />
      )}
    </div>
  );
}
