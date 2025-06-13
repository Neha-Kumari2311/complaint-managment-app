"use client";
import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRScanner({ onScan, onClose }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    // Delay slightly to ensure DOM is ready
    const timeout = setTimeout(() => {
      scanner.render(
        (decodedText) => {
          scanner.clear();
          onScan(decodedText);
          onClose();
        },
        (errorMessage) => {
          console.warn("QR Scan Error:", errorMessage);
        }
      );
    }, 100);

    // Cleanup function to properly remove scanner
    return () => {
      clearTimeout(timeout); // Clear timeout if component unmounts early

      scanner.clear().then(() => {
        const scanRegion = document.getElementById("reader");
        if (scanRegion && scanRegion.firstChild) {
          scanRegion.removeChild(scanRegion.firstChild);
        }
      }).catch((err) => {
        // Safe ignore — already removed or not found
        console.warn("Failed to clear scanner", err);
      });
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-bold mb-2">Scan QR Code</h2>
        <div id="reader" className="w-full" />
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}





