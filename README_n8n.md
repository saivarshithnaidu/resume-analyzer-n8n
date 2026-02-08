# CareerLens - ATS Resume Analyzer & Transformer (n8n Workflow)

This repository contains the backend workflow design for CareerLens, a resume analysis automation tool running on n8n.

## Deployment Requirements
-   **Platform**: n8n (Self-hosted or Cloud)
-   **Deployment Target**: Railway (Recommended for backend hosting)
-   **Dependencies**: OpenAI API Key

## Getting Started

### 1. Import Workflow
1.  Open your n8n dashboard.
2.  Go to **Workflows** > **Import**.
3.  Select the `careerlens-workflow.json` file included in this directory.
4.  The workflow diagram will appear with the following nodes:
    -   **Webhook**: Entry point for API requests.
    -   **Resume Parsing**: Normalizes input.
    -   **AI Analyzer**: Connects to OpenAI.
    -   **JSON Validation**: Ensures data integrity.
    -   **ATS Decision**: Applies logic rules.

### 2. Configure Credentials
1.  Double-click the **AI Analyzer (OpenAI)** node.
2.  Under **Credentials**, create or select an `OpenAI API` credential.
3.  Enter your OpenAI API Key.

### 3. Deploy on Railway (If not already running n8n)
1.  Use the official n8n Docker image: `docker.n8n.io/n8nio/n8n`.
2.  Set environment variables in Railway:
    -   `N8N_ basic_auth_active`: `true`
    -   `N8N_BASIC_AUTH_USER`: `admin`
    -   `N8N_BASIC_AUTH_PASSWORD`: `yoursecurepassword`
    -   `WEBHOOK_URL`: `https://your-railway-app.up.railway.app/`
3.  Once deployed, access the n8n editor via the Railway URL.

## API Usage

### Endpoint
`POST [YOUR_N8N_WEBHOOK_URL]/resume/analyze`

### Request Format (Multipart/Form-Data or JSON)
**Headers**:
-   `Content-Type: application/json`

**Body (JSON Example)**:
```json
{
  "resumeText": "Experienced Software Engineer with 5 years in React and Node.js...",
  "jobRole": "Senior Frontend Developer",
  "jobDescription": "We are looking for a React expert with TypeScript experience..."
}
```

**Note**: The workflow is designed to accept file uploads (Multipart), but the mock parsing node currently expects `resumeText` to be passed or simulates extraction.

### Response Schema
The API returns a JSON object containing:
-   `analysis`: Current ATS score and recruiter verdict.
-   `personas`: Simulated feedback from ATS, Tech Lead, and HR.
-   `optimized_resume`: The ATS-optimized version of the resume with `ats_score_optimized` and `resume_text`.
-   `decision`: `SHORTLIST` or `HOLD`.

## Workflow Logic
1.  **Parsing**: Extracts text and normalizes inputs.
2.  **AI Analysis**: Uses GPT-4o with a specialized system prompt to simulate hiring personas and optimize the resume without hallucinating data.
3.  **Validation**: A custom code node validates the AI output against the strict schema.
4.  **Decision**: Rules engine checks if `ats_score_optimized >= 80`.
