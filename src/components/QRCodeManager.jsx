import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Plus, Trash2, QrCode, FileText } from "lucide-react";
import axios from "axios";

const QRCodeManager = ({ restaurantId, restaurantName }) => {
  const [tables, setTables] = useState([]);
  const [numberOfTables, setNumberOfTables] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchTables();
  }, [restaurantId]);

  const fetchTables = async () => {
    try {
      const response = await axios.get(
        `/api/restaurant/${restaurantId}/tables`
      );
      // Sort tables numerically by table number
      const sortedTables = response.data.sort((a, b) => {
        return parseInt(a.number) - parseInt(b.number);
      });
      setTables(sortedTables);
    } catch (error) {
      console.error("Error fetching tables:", error);
      setTables([]);
    }
  };

  const generateTables = async () => {
    const numTables = parseInt(numberOfTables);

    if (!numberOfTables || numTables < 1) {
      alert("Please enter a valid number of tables");
      return;
    }

    if (numTables > 50) {
      alert(
        "Maximum 50 tables allowed at once. Please enter a number between 1 and 50."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `/api/restaurant/${restaurantId}/generate-tables`,
        {
          numberOfTables: numTables,
        }
      );

      // Sort tables numerically by table number
      const sortedTables = response.data.tables.sort((a, b) => {
        return parseInt(a.number) - parseInt(b.number);
      });
      setTables(sortedTables);
      setShowAddModal(false);
      setNumberOfTables("");
      alert(`Successfully generated ${numTables} QR codes!`);
    } catch (error) {
      console.error("Error generating tables:", error);
      alert(
        "Error generating QR codes: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteTable = async (tableId) => {
    if (!confirm("Are you sure you want to delete this table?")) return;

    try {
      await axios.delete(`/api/restaurant/${restaurantId}/tables/${tableId}`);
      setTables(tables.filter((table) => table._id !== tableId));
      alert("Table deleted successfully!");
    } catch (error) {
      console.error("Error deleting table:", error);
      alert(
        "Error deleting table: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const downloadQRCode = (tableNumber, qrSlug) => {
    const svg = document.getElementById(`qr-${tableNumber}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = 300;
    canvas.height = 350;

    img.onload = () => {
      // White background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw QR code
      ctx.drawImage(img, 25, 25, 250, 250);

      // Add text
      ctx.fillStyle = "black";
      ctx.font = "bold 18px Arial";
      ctx.textAlign = "center";
      ctx.fillText(restaurantName, canvas.width / 2, 300);
      ctx.font = "16px Arial";
      ctx.fillText(`Table ${tableNumber}`, canvas.width / 2, 325);

      // Download
      const link = document.createElement("a");
      link.download = `${restaurantName}-Table-${tableNumber}-QR.png`;
      link.href = canvas.toDataURL();
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const downloadAllQRCodes = async () => {
    if (tables.length === 0) {
      alert("No tables to download");
      return;
    }

    // Sort tables numerically for download
    const sortedTablesForDownload = [...tables].sort((a, b) => {
      return parseInt(a.number) - parseInt(b.number);
    });

    // Create a zip-like download by downloading each QR code
    for (const table of sortedTablesForDownload) {
      await new Promise((resolve) => {
        setTimeout(() => {
          downloadQRCode(table.number, table.qrSlug);
          resolve();
        }, 500); // Small delay between downloads
      });
    }
  };

  const downloadPDF = async () => {
    if (tables.length === 0) {
      alert("No QR codes to download");
      return;
    }

    try {
      // Create a printable HTML page with all QR codes
      const printWindow = window.open("", "_blank");
      const currentRestaurantName = restaurantName || "Restaurant";

      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${currentRestaurantName} - QR Codes</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              background: white;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .header h1 { 
              font-size: 24px; 
              margin: 0; 
              color: #333;
            }
            .header h2 { 
              font-size: 18px; 
              margin: 10px 0 0 0; 
              color: #666;
            }
            .qr-grid { 
              display: grid; 
              grid-template-columns: repeat(3, 1fr); 
              gap: 30px; 
              margin: 20px 0;
            }
            .qr-item { 
              text-align: center; 
              page-break-inside: avoid;
              border: 1px solid #ddd;
              padding: 20px;
              border-radius: 8px;
            }
            .qr-code { 
              margin-bottom: 15px; 
            }
            .table-number { 
              font-size: 16px; 
              font-weight: bold; 
              margin-bottom: 8px;
              color: #333;
            }
            .qr-url { 
              font-size: 10px; 
              color: #666; 
              word-break: break-all;
              margin-top: 5px;
            }
            @media print {
              body { margin: 0; }
              .qr-grid { gap: 20px; }
              .qr-item { 
                border: 1px solid #000;
                margin-bottom: 20px;
              }
            }
            @page {
              margin: 1in;
              size: A4;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${currentRestaurantName}</h1>
            <h2>QR Codes for Tables</h2>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="qr-grid">
      `;

      // Sort tables numerically for PDF
      const sortedTablesForPDF = [...tables].sort((a, b) => {
        return parseInt(a.number) - parseInt(b.number);
      });

      // Add each QR code
      for (const table of sortedTablesForPDF) {
        const qrElement = document.getElementById(`qr-${table.number}`);
        if (qrElement) {
          const svgData = new XMLSerializer().serializeToString(qrElement);
          const svgBase64 = btoa(svgData);
          const url = getQRUrl(table.qrSlug);

          htmlContent += `
            <div class="qr-item">
              <div class="qr-code">
                <img src="data:image/svg+xml;base64,${svgBase64}" width="150" height="150" />
              </div>
              <div class="table-number">Table ${table.number}</div>
              <div class="qr-url">${url}</div>
            </div>
          `;
        }
      }

      htmlContent += `
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 1000);
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        "Error generating PDF. Please try downloading individual QR codes."
      );
    }
  };

  const getQRUrl = (qrSlug) => {
    return `${window.location.origin}/t/${qrSlug}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <QrCode className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold">QR Code Management</h2>
        </div>
        <div className="flex gap-3">
          {tables.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={downloadPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={downloadAllQRCodes}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PNGs
              </button>
            </div>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Generate QR Codes
          </button>
        </div>
      </div>

      {tables.length === 0 ? (
        <div className="text-center py-12">
          <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No QR Codes Generated
          </h3>
          <p className="text-gray-600 mb-6">
            Generate QR codes for your restaurant tables to get started.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Generate QR Codes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tables.map((table) => (
            <div key={table._id} className="border rounded-lg p-4 text-center">
              <div className="mb-3">
                <QRCodeSVG
                  id={`qr-${table.number}`}
                  value={getQRUrl(table.qrSlug)}
                  size={150}
                  level="M"
                  includeMargin={true}
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Table {table.number}
              </h3>
              <p className="text-sm text-gray-600 mb-3 break-all">
                {getQRUrl(table.qrSlug)}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadQRCode(table.number, table.qrSlug)}
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 flex items-center justify-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Download
                </button>
                <button
                  onClick={() => deleteTable(table._id)}
                  className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Tables Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Generate QR Codes</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Tables
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={numberOfTables}
                onChange={(e) => {
                  const value = e.target.value;
                  if (
                    value === "" ||
                    (parseInt(value) >= 1 && parseInt(value) <= 50)
                  ) {
                    setNumberOfTables(value);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter number of tables (max 50)"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNumberOfTables("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={generateTables}
                disabled={loading || !numberOfTables}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeManager;
