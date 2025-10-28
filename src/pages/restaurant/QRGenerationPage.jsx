import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, QrCode, Plus, Download, Trash2, FileText } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../../context/MultiAuthContext";
import axios from "axios";

const QRGenerationPage = () => {
  const navigate = useNavigate();
  const {
    isRestaurantAuthenticated,
    getRestaurantSession,
    getToken,
    loading: authLoading,
  } = useAuth();
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [numberOfTables, setNumberOfTables] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedTables, setGeneratedTables] = useState([]);

  // Check restaurant authentication
  useEffect(() => {
    if (!authLoading && !isRestaurantAuthenticated) {
      navigate("/restaurant/login");
    }
  }, [authLoading, isRestaurantAuthenticated, navigate]);

  useEffect(() => {
    if (isRestaurantAuthenticated) {
      fetchRestaurantInfo();
    }
  }, [isRestaurantAuthenticated]);



  const fetchRestaurantInfo = async () => {
    try {
      // Set axios authorization header
      const token = getToken("restaurant");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const { data } = await axios.get("/api/auth/me");
      console.log("Auth me response:", data);
      
      // Extract restaurant info from the response
      const restaurantData = data.restaurant || data;
      setRestaurantInfo(restaurantData);
      console.log("Restaurant info loaded:", restaurantData);
    } catch (error) {
      console.error("Error fetching restaurant info:", error);
    }
  };

  const generateTables = async () => {
    const numTables = parseInt(numberOfTables);
    
    if (!numberOfTables || numTables < 1) {
      alert("Please enter a valid number of tables");
      return;
    }

    if (numTables > 50) {
      alert("Maximum 50 tables allowed at once. Please enter a number between 1 and 50.");
      return;
    }

    if (!restaurantInfo || !restaurantInfo._id) {
      alert(
        "Restaurant information not loaded. Please refresh the page and try again."
      );
      return;
    }

    setLoading(true);
    try {
      console.log("Generating tables for restaurant:", restaurantInfo._id);
      console.log("Restaurant info:", restaurantInfo);
      console.log("Restaurant ID type:", typeof restaurantInfo._id);
      console.log("Restaurant ID length:", restaurantInfo._id?.length);
      console.log("Number of tables to generate:", numberOfTables);
      
      // Add timeout to the request (30 seconds)
      const response = await axios.post(
        `/api/restaurant/${restaurantInfo._id}/generate-tables`,
        {
          numberOfTables: parseInt(numberOfTables),
        },
        {
          timeout: 30000 // 30 seconds timeout
        }
      );

      // Store the generated tables to display them
      console.log("API Response:", response.data);
      console.log("Tables received:", response.data.tables);
      
      if (response.data.tables && response.data.tables.length > 0) {
        setGeneratedTables(response.data.tables);
        console.log("Generated tables state set:", response.data.tables);
        alert(`Successfully generated ${numberOfTables} QR codes!`);
      } else {
        console.error("No tables in response");
        alert("Error: No tables were generated. Please try again.");
      }
    } catch (error) {
      console.error("Error generating tables:", error);
      
      if (error.code === 'ECONNABORTED') {
        alert("Request timed out. The server might be busy. Please try with fewer tables or try again later.");
      } else if (error.response) {
        // Server responded with error
        console.error("Server error response:", error.response.data);
        alert("Error generating QR codes: " + (error.response?.data?.message || error.message));
      } else if (error.request) {
        // Request was made but no response
        console.error("No response from server:", error.request);
        alert("No response from server. Please check your connection and try again.");
      } else {
        // Something else happened
        console.error("Request setup error:", error.message);
        alert("Error setting up request: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getQRUrl = (qrSlug) => {
    return `${window.location.origin}/t/${qrSlug}`;
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
      ctx.fillText(
        restaurantInfo?.restaurantName || "Restaurant",
        canvas.width / 2,
        300
      );
      ctx.font = "16px Arial";
      ctx.fillText(`Table ${tableNumber}`, canvas.width / 2, 325);

      // Download
      const link = document.createElement("a");
      link.download = `${
        restaurantInfo?.restaurantName || "Restaurant"
      }-Table-${tableNumber}-QR.png`;
      link.href = canvas.toDataURL();
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const downloadAllQRCodes = async () => {
    if (generatedTables.length === 0) {
      alert("No QR codes to download");
      return;
    }

    // Sort tables numerically for download
    const sortedTablesForDownload = [...generatedTables].sort((a, b) => {
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
    if (generatedTables.length === 0) {
      alert("No QR codes to download");
      return;
    }

    try {
      // Create a printable HTML page with all QR codes
      const printWindow = window.open('', '_blank');
      const restaurantName = restaurantInfo?.restaurantName || 'Restaurant';
      
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${restaurantName} - QR Codes</title>
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
            <h1>${restaurantName}</h1>
            <h2>QR Codes for Tables</h2>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="qr-grid">
      `;

      // Sort tables numerically for PDF
      const sortedTablesForPDF = [...generatedTables].sort((a, b) => {
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
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try downloading individual QR codes.');
    }
  };

  const deleteTable = async (tableId) => {
    if (!confirm("Are you sure you want to delete this table?")) return;

    try {
      await axios.delete(
        `/api/restaurant/${restaurantInfo._id}/tables/${tableId}`
      );
      setGeneratedTables(
        generatedTables.filter((table) => table._id !== tableId)
      );
      alert("Table deleted successfully!");
    } catch (error) {
      console.error("Error deleting table:", error);
      alert(
        "Error deleting table: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  if (authLoading || !restaurantInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurant information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/restaurant/dashboard")}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Generate QR Codes
              </h1>
              <p className="text-sm text-gray-600">
                {restaurantInfo?.restaurantName} • Create QR codes for your
                tables
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
              <QrCode className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Generate Table QR Codes
            </h2>
            <p className="text-gray-600">
              Create unique QR codes for each table in your restaurant.
              Customers will scan these to access your menu directly.
            </p>
          </div>

          <div className="space-y-6">
            <div>
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
                  if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 50)) {
                    setNumberOfTables(value);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                placeholder="Enter number of tables (max 50)"
              />
              <p className="text-sm text-gray-500 mt-2">
                This will generate QR codes for tables numbered 1 through{" "}
                {numberOfTables || "N"} (Maximum: 50 tables)
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                What happens next?
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Unique QR codes will be generated for each table</li>
                <li>• Each QR code will link directly to your menu</li>
                <li>
                  • Table numbers will be automatically detected when customers
                  scan
                </li>
                <li>• You can download and print the QR codes</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">
                ⚠️ Important Note
              </h3>
              <p className="text-sm text-yellow-800">
                Generating new QR codes will replace any existing QR codes for
                this restaurant. Make sure to download your current QR codes if
                you need to keep them.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/restaurant/dashboard")}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={generateTables}
                disabled={loading || !numberOfTables || !restaurantInfo?._id}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Generate QR Codes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Section - Only show if no QR codes have been generated */}
        {numberOfTables &&
          numberOfTables > 0 &&
          generatedTables.length === 0 && (
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {Array.from(
                  { length: Math.min(parseInt(numberOfTables), 12) },
                  (_, i) => (
                    <div
                      key={i}
                      className="text-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded mx-auto mb-2 flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium">Table {i + 1}</p>
                    </div>
                  )
                )}
                {parseInt(numberOfTables) > 12 && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg flex items-center justify-center">
                    <p className="text-sm text-gray-500">
                      +{parseInt(numberOfTables) - 12} more
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Generated QR Codes Section */}
        {generatedTables.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Generated QR Codes
                </h3>
                <p className="text-sm text-gray-600">
                  {generatedTables.length} QR codes generated successfully
                </p>
              </div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {generatedTables
                .sort((a, b) => parseInt(a.number) - parseInt(b.number))
                .map((table) => (
                <div
                  key={table._id}
                  className="border rounded-lg p-4 text-center bg-gray-50"
                >
                  <div className="mb-3">
                    <QRCodeSVG
                      id={`qr-${table.number}`}
                      value={getQRUrl(table.qrSlug)}
                      size={150}
                      level="M"
                      includeMargin={true}
                    />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">
                    Table {table.number}
                  </h4>
                  <p className="text-xs text-gray-600 mb-3 break-all">
                    {getQRUrl(table.qrSlug)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadQRCode(table.number, table.qrSlug)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
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

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Next Steps:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Download as PDF (recommended) or individual PNG files</li>
                <li>• Print the QR codes and place them on your tables</li>
                <li>• Customers can scan to access your menu directly</li>
                <li>• Orders will automatically include the table number</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default QRGenerationPage;
