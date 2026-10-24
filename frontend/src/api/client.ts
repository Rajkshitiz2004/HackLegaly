import {
  Jurisdiction,
  LegalAssistantResponse,
  DetectPrivacyResponse,
  RedactResponse,
  SecondScanResponse,
  ConsentResponse,
  DocumentAnalysisResult,
  CompareResult,
  KnowledgeArticle,
  LegalAidResource,
  LegalSource,
} from '../types';

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorDetail = `Request failed with status ${res.status}`;
    try {
      const errorJson = await res.json();
      if (errorJson.detail) {
        errorDetail = typeof errorJson.detail === 'string' ? errorJson.detail : JSON.stringify(errorJson.detail);
      }
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }
  return res.json();
}

export const api = {
  // Jurisdictions
  async getJurisdictions(): Promise<Jurisdiction[]> {
    const res = await fetch(`${API_BASE}/jurisdictions`);
    return handleResponse<Jurisdiction[]>(res);
  },

  // Legal Assistant
  async getSuggestedQuestions(): Promise<Array<{ id: string; title: string; query: string; category: string }>> {
    const res = await fetch(`${API_BASE}/legal-assistant/suggested`);
    return handleResponse(res);
  },

  async askLegalAssistant(query: string, jurisdictionCode: string = 'IN-CENTRAL', sessionId?: string): Promise<LegalAssistantResponse> {
    const res = await fetch(`${API_BASE}/legal-assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, jurisdiction_code: jurisdictionCode, session_id: sessionId }),
    });
    return handleResponse<LegalAssistantResponse>(res);
  },

  // Knowledge & Resources
  async getLegalSources(jurisdictionId?: string): Promise<LegalSource[]> {
    const url = jurisdictionId ? `${API_BASE}/legal-sources?jurisdiction_id=${jurisdictionId}` : `${API_BASE}/legal-sources`;
    const res = await fetch(url);
    return handleResponse<LegalSource[]>(res);
  },

  async getLegalGuides(category?: string, search?: string): Promise<KnowledgeArticle[]> {
    const params = new URLSearchParams();
    if (category && category !== 'ALL') params.append('category', category);
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/legal-guides?${params.toString()}`);
    return handleResponse<KnowledgeArticle[]>(res);
  },

  async getLegalGuideBySlug(slug: string): Promise<KnowledgeArticle> {
    const res = await fetch(`${API_BASE}/legal-guides/${slug}`);
    return handleResponse<KnowledgeArticle>(res);
  },

  async getResources(category?: string): Promise<LegalAidResource[]> {
    const url = category && category !== 'ALL' ? `${API_BASE}/resources?category=${category}` : `${API_BASE}/resources`;
    const res = await fetch(url);
    return handleResponse<LegalAidResource[]>(res);
  },

  // Document Simplifier & Privacy
  async getSyntheticSample(): Promise<{ title: string; document_type: string; text: string; sample_entities_expected: string[] }> {
    const res = await fetch(`${API_BASE}/documents/synthetic-sample`);
    return handleResponse(res);
  },

  async uploadDocument(file?: File, rawText?: string, title?: string): Promise<any> {
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (rawText) formData.append('raw_text', rawText);
    if (title) formData.append('title', title);

    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(res);
  },

  async detectPII(text: string, customTerms?: string[]): Promise<DetectPrivacyResponse> {
    const res = await fetch(`${API_BASE}/privacy/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, custom_terms: customTerms || [] }),
    });
    return handleResponse<DetectPrivacyResponse>(res);
  },

  async redactText(originalText: string, redactions: any[], documentVersionId?: string): Promise<RedactResponse> {
    const res = await fetch(`${API_BASE}/privacy/redact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        original_text: originalText,
        redactions,
        document_version_id: documentVersionId,
      }),
    });
    return handleResponse<RedactResponse>(res);
  },

  async runSecondScan(redactedText: string): Promise<SecondScanResponse> {
    const res = await fetch(`${API_BASE}/privacy/second-scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ redacted_text: redactedText }),
    });
    return handleResponse<SecondScanResponse>(res);
  },

  async grantConsent(contentHash: string, documentVersionId?: string, affirmativeAction: boolean = true): Promise<ConsentResponse> {
    const res = await fetch(`${API_BASE}/privacy/consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content_hash: contentHash,
        document_version_id: documentVersionId || 'ephemeral-version',
        affirmative_action: affirmativeAction,
        destination_provider: 'google-gemini',
        purpose: 'LEGAL_DOCUMENT_SIMPLIFICATION',
      }),
    });
    return handleResponse<ConsentResponse>(res);
  },

  async analyzeDocument(text: string, contentHash: string, documentVersionId?: string): Promise<DocumentAnalysisResult> {
    const res = await fetch(`${API_BASE}/documents/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        content_hash: contentHash,
        document_version_id: documentVersionId || 'ephemeral-version',
      }),
    });
    return handleResponse<DocumentAnalysisResult>(res);
  },

  async compareDocuments(baseText: string, targetText: string): Promise<CompareResult> {
    const res = await fetch(`${API_BASE}/documents/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base_text: baseText, target_text: targetText }),
    });
    return handleResponse<CompareResult>(res);
  },

  // Navigator
  async getNavigatorQuestions(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/navigator/questions`);
    return handleResponse(res);
  },

  async evaluateNavigator(category: string, responses: Record<string, string>): Promise<any> {
    const res = await fetch(`${API_BASE}/navigator/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, responses }),
    });
    return handleResponse(res);
  },

  // System Health
  async getHealth(): Promise<{ status: string; service: string; demo_mode: boolean; ai_provider: string; database: string }> {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  },
};
