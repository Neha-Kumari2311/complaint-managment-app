// "use client";
// import { useState } from "react";
// import dynamic from "next/dynamic";

// const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

// export default function QRScanner({ onScan, onClose }) {
//   const [error, setError] = useState("");

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-xl shadow-lg w-[350px] text-center">
//         <h2 className="text-lg font-semibold mb-4">Scan Resident QR</h2>

//         <QrReader
//           delay={300}
//           onError={(err) => setError(err?.message || "Error")}
//           onScan={(result) => {
//             if (result) onScan(result);
//           }}
//           style={{ width: "100%" }}
//         />

//         {error && <p className="text-red-500 mt-2">{error}</p>}

//         <button
//           className="mt-4 bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
//           onClick={onClose}
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// }
