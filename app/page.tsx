"use client";

import { useState } from "react";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file || !jd) {
      alert("Upload resume and paste Job Description");
      return;
    }

    setLoading(true);

    // 🔗 n8n webhook will go here later
    setTimeout(() => {
      setLoading(false);
      alert("Frontend ready. Backend will connect via n8n.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900">
          AI Resume Analyzer & ATS Scorer
        </h1>
        <p className="text-gray-600 mt-2">
          Upload your resume and job description to get ATS score & improvements
        </p>

        {/* Resume Upload */}
        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700">
            Upload Resume (PDF / DOCX)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-2 w-full border rounded-md p-2"
          />
        </div>

        {/* Job Description */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            rows={6}
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste job description here..."
            className="mt-2 w-full border rounded-md p-3"
          />
        </div>

        {/* Analyze Button */}
        <div className="mt-6">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

        {/* RESULT UI (STATIC FOR NOW) */}
        <div className="mt-10 border-t pt-8">
          <h2 className="text-xl font-semibold text-gray-900">
            ATS Analysis Result
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">ATS Score</p>
              <p className="text-3xl font-bold text-green-700">82</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Missing Keywords</p>
              <p className="font-medium text-yellow-700">
                Docker, REST APIs, CI/CD
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Format Status</p>
              <p className="font-medium text-blue-700">
                ATS Friendly ✅
              </p>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Improvement Suggestions</p>
            <ul className="list-disc ml-5 mt-2 text-gray-800">
              <li>Add quantified achievements</li>
              <li>Include missing technical keywords</li>
              <li>Improve project descriptions using action verbs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
