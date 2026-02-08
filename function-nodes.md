# Function Node Logic Documentation

This document explains the JavaScript logic used in the **Code Nodes** of the CareerLens n8n workflow.

## 1. Resume Parsing & Normalization
**Goal**: Normalize input and simulate text extraction from binary files.

```javascript
// Resume Parsing Logic
// In a real deployment, use a dedicated PDF/DOCX extraction node or library.
// This node mocks the extraction for demonstration purposes or expects 'resumeText' in the body if testing via JSON.

const items = $input.all();
return items.map(item => {
  // 1. Try to get text from JSON body (testing)
  let text = item.json.resumeText;

  // 2. Logic to extract from binary would go here.
  // e.g., const binaryData = item.binary.resume;
  // const extracted = await pdfParse(binaryData);

  if (!text) {
    text = "[ERROR] No resume text found. Please ensure the file is parsed correctly.";
  }

  return {
    json: {
      resumeText: text,
      jobRole: item.json.jobRole || "General Role",
      jobDescription: item.json.jobDescription || "Standard industry requirements apply."
    }
  };
});
```

---

## 2. JSON Validation
**Goal**: Ensure the AI output conforms strictly to the required schema before processing.

```javascript
// JSON Validation Node
const items = $input.all();

return items.map(item => {
  let aiResponse = item.json.message ? item.json.message.content : item.json;
  
  // Ensure it's an object
  if (typeof aiResponse === 'string') {
    try {
      aiResponse = JSON.parse(aiResponse);
    } catch (e) {
      throw new Error("AI Response is not valid JSON");
    }
  }

  // Schema Check Helper
  const hasKeys = (obj, keys) => keys.every(key => key in obj);

  // Validate Top Level Keys
  const requiredKeys = ["analysis", "personas", "job_intelligence", "skill_gap", "decision_log", "optimized_resume"];
  if (!hasKeys(aiResponse, requiredKeys)) {
    throw new Error("Missing required top-level keys in AI response");
  }

  // Validate Analysis
  if (typeof aiResponse.analysis.ats_score_current !== 'number') throw new Error("Invalid analysis.ats_score_current");

  // Validate Optimized Resume
  if (typeof aiResponse.optimized_resume.ats_score_optimized !== 'number') throw new Error("Invalid optimized_resume.ats_score_optimized");
  if (!aiResponse.optimized_resume.resume_text) throw new Error("Missing optimized_resume.resume_text");

  return {
    json: {
      ...aiResponse,
      validation_status: "passed"
    }
  };
});
```

---

## 3. ATS Decision Logic
**Goal**: Make a hiring decision (SHORTLIST or HOLD) based on the optimized ATS score.

```javascript
// ATS Decision Logic Node
const items = $input.all();

return items.map(item => {
  const data = item.json;
  const atsScore = data.optimized_resume.ats_score_optimized;
  
  let finalDecision = "HOLD";
  
  // Logic: If optimized ATS score >= 80 -> SHORTLIST
  if (atsScore >= 80) {
    finalDecision = "SHORTLIST";
  }
  
  // Add decision logic to the personas output as well for consistency
  data.personas.final_automation_decision = finalDecision;
  
  return {
    json: {
      status: "success",
      decision: finalDecision,
      data: data
    }
  };
});
```
