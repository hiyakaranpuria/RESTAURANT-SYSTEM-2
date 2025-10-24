import { useState, useEffect } from "react";
import axios from "axios";

const TablesPage = () => {
  const [tables, setTables] = useState([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const { data } = await axios.get("/api/tables");
      setTables(data);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  const generateQR = async (table) => {
    try {
      const { data } = await axios.get(`/api/tables/${table._id}/qr`);
      setQrCodeUrl(data.qrCode);
      setSelectedTable(table);
      setShowQRModal(true);
    } catch (error) {
      console.error("Error generating QR:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white border-r">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div>
              <h1 className="text-base font-semibold">RestauAdmin</h1>
              <p className="text-sm text-gray-500">Main Menu</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <a
              className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              href="#"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <p className="text-sm font-medium">Dashboard</p>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              href="#"
            >
              <span className="material-symbols-outlined">receipt_long</span>
              <p className="text-sm font-medium">Orders</p>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              href="#"
            >
              <span className="material-symbols-outlined">menu_book</span>
              <p className="text-sm font-medium">Menu</p>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600"
              href="#"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                table_restaurant
              </span>
              <p className="text-sm font-medium">Tables</p>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              href="#"
            >
              <span className="material-symbols-outlined">settings</span>
              <p className="text-sm font-medium">Settings</p>
            </a>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 bg-[#F9FAFB]">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Tables & QR Codes</h1>
            <p className="text-gray-600 mt-2">
              Add and manage your restaurant's tables. Generate a unique QR code
              for each table.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white rounded-lg h-10 px-4 text-sm font-bold shadow-sm hover:bg-blue-700">
            <span className="material-symbols-outlined">add</span>
            <span>Add New Table</span>
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-stretch rounded-lg h-10 bg-white shadow-sm border max-w-sm">
            <div className="flex items-center justify-center pl-4 text-gray-400">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="flex-1 px-2 border-none text-sm focus:outline-none"
              placeholder="Search by table name or number"
            />
          </div>
        </div>

        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 text-left w-12">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-600">
                  Table Name / Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-600">
                  Seating Capacity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tables.map((table) => (
                <tr key={table._id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-2 text-sm font-medium">
                    {table.number}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">4</td>
                  <td className="px-4 py-2 text-sm">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => generateQR(table)}
                        className="flex w-8 h-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                      >
                        <span className="material-symbols-outlined">
                          qr_code_2
                        </span>
                      </button>
                      <button className="flex w-8 h-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-blue-600">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button className="flex w-8 h-8 items-center justify-center rounded-md text-gray-500 hover:bg-red-100 hover:text-red-600">
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-center p-4 border-t">
            <nav className="flex items-center gap-1">
              <button className="flex w-8 h-8 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="flex w-8 h-8 items-center justify-center rounded-md bg-blue-50 text-blue-600 text-sm font-bold">
                1
              </button>
              <button className="flex w-8 h-8 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 text-sm">
                2
              </button>
              <button className="flex w-8 h-8 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </nav>
          </div>
        </div>
      </main>

      {showQRModal && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setShowQRModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold">
                    QR Code for {selectedTable?.number}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Scan this code to access the menu.
                  </p>
                </div>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="flex justify-center p-4 bg-gray-100 rounded-lg">
                <img className="rounded-md" src={qrCodeUrl} alt="QR Code" />
              </div>
              <p className="text-center text-xs text-gray-500 mt-4">
                Download or print it to place on the table.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-gray-100 text-gray-800 text-sm font-bold hover:bg-gray-200">
                  <span className="material-symbols-outlined">download</span>
                  <span>Download as PNG</span>
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700">
                  <span className="material-symbols-outlined">print</span>
                  <span>Print</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TablesPage;
