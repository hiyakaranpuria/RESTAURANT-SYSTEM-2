import { useState } from "react";
import axios from "axios";

const MigrationTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testEndpoint = async () => {
    try {
      setLoading(true);
      
      // First test feedback debug endpoint
      console.log("Testing feedback debug endpoint...");
      const feedbackResponse = await axios.get("/api/feedback/debug");
      console.log("Feedback debug response:", feedbackResponse.data);
      
      // Then test migration endpoint
      console.log("Testing migration endpoint...");
      const migrationResponse = await axios.get("/api/migration/test");
      console.log("Migration response:", migrationResponse.data);
      
      setResult({ 
        type: "success", 
        message: "Both endpoints working", 
        data: { 
          feedback: feedbackResponse.data, 
          migration: migrationResponse.data 
        } 
      });
    } catch (error) {
      console.error("Endpoint test error:", error);
      setResult({ 
        type: "error", 
        message: "Endpoint test failed", 
        data: {
          error: error.response?.data || error.message,
          status: error.response?.status,
          url: error.config?.url
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const runMigration = async () => {
    if (!confirm("This will update all existing orders. Continue?")) {
      return;
    }

    try {
      setLoading(true);
      console.log("Running migration via feedback routes...");
      const response = await axios.post("/api/feedback/migrate-orders");
      console.log("Migration response:", response.data);
      setResult({ type: "success", message: "Migration completed", data: response.data });
    } catch (error) {
      console.error("Migration error:", error);
      setResult({ 
        type: "error", 
        message: "Migration failed", 
        data: {
          error: error.response?.data || error.message,
          status: error.response?.status,
          url: error.config?.url
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Migration Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Migration Endpoint</h2>
          <button
            onClick={testEndpoint}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 mr-4"
          >
            {loading ? "Testing..." : "Test Endpoint"}
          </button>
          
          <button
            onClick={runMigration}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Running..." : "Run Migration"}
          </button>
        </div>

        {result && (
          <div className={`rounded-lg p-4 ${
            result.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          }`}>
            <h3 className={`font-semibold mb-2 ${
              result.type === "success" ? "text-green-800" : "text-red-800"
            }`}>
              {result.message}
            </h3>
            <pre className={`text-sm ${
              result.type === "success" ? "text-green-700" : "text-red-700"
            }`}>
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default MigrationTest;