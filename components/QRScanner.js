// "use client";

// import { Html5QrcodeScanner } from "html5-qrcode";
// import { useEffect } from "react";

// export default function QRScanner({ onScan, onClose }) {
//   useEffect(() => {
//     const scanner = new Html5QrcodeScanner("reader", {
//       fps: 10,
//       qrbox: { width: 250, height: 250 },
//       rememberLastUsedCamera: true,
//     });

//     scanner.render(
//       (decodedText) => {
//         console.log("✅ QR Code Scanned:", decodedText);
//         onScan(decodedText);
//         scanner.clear();
//       },
//       (errorMessage) => {
//         // Suppress common scanning noise
//       }
//     );

//     return () => {
//       scanner.clear().catch((err) => {
//         console.error("Scanner cleanup error:", err);
//       });
//     };
//   }, []);

// return (
//   <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50">
//     <div className="relative bg-white rounded-xl shadow-lg p-4 w-[360px] h-[400px] flex flex-col items-center justify-start">
//       {/* ✅ Better positioned close button */}
//       <button
//         onClick={onClose}
//         className="absolute top-2 right-2 text-red-500 text-2xl font-bold"
//       >
//         ✕
//       </button>
//       <div
//         id="reader"
//         className="w-full h-[320px] border border-gray-400 rounded-lg"
//       ></div>
//     </div>
//   </div>
// );

// }
"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function QRScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      rememberLastUsedCamera: true,
    });

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        console.log("✅ QR Code Scanned:", decodedText);
        toast.success("QR Code scanned successfully!");
        onScan(decodedText);

        // Clear and close only once
        scanner
          .clear()
          .then(() => {
            console.log("Scanner cleared after scan.");
          })
          .catch((err) => {
            console.warn("Clear error after scan:", err.message);
            toast.error("Scanner clear failed.");
          });
      },
      (errorMessage) => {
        // Suppress continuous scanning noise
        // Optionally, you could toast.error(errorMessage) for debugging
      }
    );

    // Cleanup on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .clear()
          .then(() => {
            console.log("Scanner cleared on unmount.");
          })
          .catch((err) => {
            if (
              err.message.includes("Cannot transition") ||
              err.message.includes("already under transition") ||
              err.message.includes("not a child")
            ) {
              console.warn("Safe to ignore scanner cleanup error:", err.message);
            } else {
              console.error("Unexpected cleanup error:", err);
              toast.error("Scanner cleanup error.");
            }
          });
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-xl shadow-lg p-4 w-[360px] h-[400px] flex flex-col items-center justify-start">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-red-500 text-2xl font-bold hover:scale-110 transition-transform"
          aria-label="Close QR Scanner"
        >
          ✕
        </button>
        <div
          id="reader"
          className="w-full h-[320px] border border-gray-400 rounded-lg mt-6"
        ></div>
      </div>
    </div>
  );
}


