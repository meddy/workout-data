import { useGoogleLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tokenExpiration, setTokenExpiration] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string>(
    window.localStorage.getItem("documentId") ?? ""
  );
  const [documentContent, setDocumentContent] = useState<string | null>(null);

  useEffect(() => {
    if (tokenExpiration !== null) {
      const id = setTimeout(() => {
        console.info("Access token expired.");
        setAccessToken(null);
        setTokenExpiration(null);
      }, tokenExpiration * 10);

      return () => {
        clearTimeout(id);
      };
    }
  }, [tokenExpiration]);

  const authorize = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/drive.readonly",
    onSuccess: ({ access_token, expires_in }) => {
      setAccessToken(access_token);
      setTokenExpiration(expires_in);
      fetchDocument(access_token);
    },
    onError: (errorResp) => {
      console.error("Failed authorizing:", errorResp);
      setError("Failed to authorize Google Drive access.");
    },
  });

  const onFetchDocument = () => {
    setDocumentContent(null);

    if (!accessToken) {
      authorize();
    } else {
      fetchDocument(accessToken);
    }

    window.localStorage.setItem("documentId", documentId);
  };

  const fetchDocument = async (accessToken: string) => {
    try {
      const url = `https://www.googleapis.com/drive/v3/files/${documentId}/export?mimeType=text/plain`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setDocumentContent(await response.text());
      } else {
        setError("An error occurred while fetching the document.");
        console.error("Failed fetching document:", response);
      }
    } catch (error) {
      setError("An error occurred while fetching the document.");
      console.error("Failed fetching document:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-semibold mb-4">Workout Data</h1>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="text"
            className="border px-4 py-2 rounded-md focus:outline-none focus:border-blue-500"
            placeholder="Enter Document ID"
            value={documentId}
            onChange={(e) => setDocumentId(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            onClick={onFetchDocument}
          >
            Load
          </button>
        </div>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        {documentContent && <pre>{documentContent.substring(0, 100)}</pre>}
      </div>
    </div>
  );
}

export default App;
