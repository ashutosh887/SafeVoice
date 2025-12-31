export const DATADOG_EVENTS = {
    PIPELINE_START: "pipeline.start",
    PIPELINE_COMPLETE: "pipeline.complete",
  
    TRANSCRIPTION_START: "transcription.start",
    TRANSCRIPTION_SUCCESS: "transcription.success",
    TRANSCRIPTION_ERROR: "transcription.error",
    TRANSCRIPTION_EXCEPTION: "transcription.exception",
  
    EXTRACTION_GEMINI_START: "extraction.gemini.start",
    EXTRACTION_GEMINI_SUCCESS: "extraction.gemini.success",
    EXTRACTION_GEMINI_ERROR: "extraction.gemini.error",
    EXTRACTION_GEMINI_TEXT_EMPTY: "extraction.gemini.text_empty",
    EXTRACTION_GEMINI_PARSE_FAILED: "extraction.gemini.parse_failed",
    EXTRACTION_GEMINI_EXCEPTION: "extraction.gemini.exception",
  
    EXTRACTION_OPENAI_START: "extraction.openai.start",
    EXTRACTION_OPENAI_SUCCESS: "extraction.openai.success",
    EXTRACTION_OPENAI_ERROR: "extraction.openai.error",
    EXTRACTION_OPENAI_EMPTY: "extraction.openai.empty",
    EXTRACTION_OPENAI_TEXT_EMPTY: "extraction.openai.text_empty",
    EXTRACTION_OPENAI_PARSE_FAILED: "extraction.openai.parse_failed",
    EXTRACTION_OPENAI_EXCEPTION: "extraction.openai.exception",

    GEMINI_INSIGHTS_START: "gemini.insights.start",
    GEMINI_INSIGHTS_SUCCESS: "gemini.insights.success",
    GEMINI_INSIGHTS_ERROR: "gemini.insights.error",
    GEMINI_INSIGHTS_EMPTY: "gemini.insights.empty",
    GEMINI_INSIGHTS_EXCEPTION: "gemini.insights.exception",

    CRISIS_DETECTED: "crisis.detected",
    RISK_COMPUTED: "risk.computed",
    SAFETY_PLAN_GENERATED: "safety_plan.generated",
  
    INCIDENT_PROCESSED: "incident.processed",
  };
  