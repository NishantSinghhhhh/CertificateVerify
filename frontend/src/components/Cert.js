import React, { useState } from "react";
import logo from "../assets/oss_logo.png";
import logoait from "../assets/AIT.svg";
import axios from "axios";
import oss from "../assets/oss_logo.png";

const API_URL = process.env.REACT_APP_API_URL || "";

const NumberVerificationForm = () => {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    if (!number.trim()) {
      setError("Please enter a certificate number");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/verify-certificate`, {
        certificateNumber: number,
      });

      setResult(response.data);
    } catch (err) {
      setError("Unique Certificate Number is Invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-full w-full flex flex-col items-center justify-center bg-gray-50 p-4 pt-[100px]">
      {/* Header Section */}
      <div className="w-full h-[100px] p-10 flex fixed top-0 justify-between items-center bg-white shadow-md">
        <a href="https://oss.com" target="_blank" rel="noreferrer">
          <img src={logo} alt="Logo" className="h-12 w-12" />
        </a>
        <img src={logoait} alt="Secondary Logo" className="h-20 w-20" />
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col justify-center items-center w-[100%] max-w-lg bg-white rounded-lg shadow-lg p-6 mt-[60px] mb-[30px]">
        <img src={oss} alt="Secondary Logo" className="w-40" />
        <h1 className="text-2xl font-bold text-center mb-6 mt-6">
          Certificate Verification
        </h1>
        <p className="text-gray-600 mb-6 text-center text-sm">
          Enter the unique number printed on the your certificate.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Field */}
          <input
            type="text"
            placeholder="Enter certificate number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 mt-4 focus:border-transparent"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify Certificate"}
          </button>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md">{error}</div>
          )}

          {/* Result Section */}
          {result && (
            <div className="mt-6 border rounded-lg overflow-hidden">
              <div
                className={`p-4 ${
                  result.isValid ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <p className="text-lg font-semibold">
                  Status:{" "}
                  {result.isValid ? (
                    <span className="text-green-600">Valid Certificate</span>
                  ) : (
                    <span className="text-red-600">Invalid Certificate</span>
                  )}
                </p>
              </div>

              {result.isValid && result.certificateDetails && (
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <p className="text-gray-600">Certificate ID:</p>
                    <p className="col-span-2 font-medium">
                      {result.certificateDetails.certificateId}
                    </p>

                    <p className="text-gray-600">Holder Name:</p>
                    <p className="col-span-2 font-medium">
                      {result.certificateDetails.holderName}
                    </p>

                    <p className="text-gray-600">Category:</p>
                    <p className="col-span-2 font-medium">
                      {result.certificateDetails.category}
                    </p>

                    <p className="text-gray-600">School:</p>
                    <p className="col-span-2 font-medium">
                      {result.certificateDetails.school}
                    </p>

                    <p className="text-gray-600">Issue Date:</p>
                    <p className="col-span-2 font-medium">
                      {result.certificateDetails.issueDate}
                    </p>

                    <p className="text-gray-600">Status:</p>
                    <p className="col-span-2 font-medium">
                      {result.certificateDetails.status}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
      {/* Footer Section */}
      <footer className="w-full mt-auto text-center py-4 text-gray-600 text-sm">
        &copy; {new Date().getFullYear()}{" "}
        <a href="https://aitoss.club.com" target="_blank" rel="noreferrer">
          oss
        </a>{" "}
        All rights reserved.
      </footer>
    </div>
  );
};

export default NumberVerificationForm;
