export interface Jurisdiction {
  id: string;
  code: string;
  name: string;
  level: string;
  parent_id?: string | null;
}

export interface NextStep {
  id?: string;
  title: string;
  description: string;
  step_order: number;
  is_completed: boolean;
  rationale?: string | null;
  required_info?: string | null;
}

export interface LegalAssistantResponse {
  query_id: string;
  response_id: string;
  simple_explanation: string;
  legal_information: string;
  conditions_exceptions?: string | null;
  practical_steps?: string | null;
  professional_help_advice?: string | null;
  evidence_sufficiency: string;
  confidence_score: number;
  ai_provider: string;
  model_name: string;
  is_demo_mode: boolean;
  created_at: string;
  next_steps: NextStep[];
  sources: Array<{
    source_id?: string;
    title: string;
    short_name: string;
    section_number?: string;
    provision_title?: string;
    excerpt?: string;
    official_url?: string;
    issuing_authority?: string;
  }>;
}

export interface SensitiveFinding {
  id?: string;
  entity_type: string;
  detected_text: string;
  start_char: number;
  end_char: number;
  confidence_score: number;
  is_redacted: boolean;
  replacement_placeholder: string;
}

export interface DetectPrivacyResponse {
  total_findings: number;
  findings: SensitiveFinding[];
  content_hash: string;
}

export interface RedactResponse {
  redacted_text: string;
  content_hash: string;
  total_redacted: number;
  applied_actions: Array<{
    action_type: string;
    original_value_masked: string;
    placeholder_used: string;
    start_char: number;
    end_char: number;
  }>;
}

export interface SecondScanResponse {
  scan_type: string;
  total_residual_findings: number;
  is_clean: boolean;
  residual_findings: SensitiveFinding[];
  warning_message: string;
}

export interface ConsentResponse {
  consent_id: string;
  content_hash: string;
  destination_provider: string;
  consented_at: string;
  expires_at: string;
  status: string;
}

export interface ClauseExplanation {
  clause_title: string;
  raw_text: string;
  simplified_explanation: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  legal_context?: string | null;
}

export interface PotentialConcern {
  concern_title: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  description: string;
  suggested_remedy?: string | null;
}

export interface DocumentDeadline {
  obligation_title: string;
  explicit_date?: string | null;
  calculated_date?: string | null;
  is_inferred: boolean;
  notice_period_days?: number | null;
  penalty_notes?: string | null;
}

export interface DocumentAnalysisResult {
  overview: string;
  plain_language_summary: string;
  processing_status: string;
  ai_provider: string;
  model_name: string;
  is_demo_mode: boolean;
  clauses: ClauseExplanation[];
  concerns: PotentialConcern[];
  deadlines: DocumentDeadline[];
  questions_to_ask_lawyer: string[];
  suggested_next_steps: string[];
}

export interface CompareResult {
  summary: string;
  added_lines_count: number;
  removed_lines_count: number;
  payment_changes: string;
  termination_changes: string;
  liability_changes: string;
  notice_changes: string;
  diff_blocks: Array<{
    type: 'unchanged' | 'modified' | 'added' | 'removed';
    base_lines: string[];
    target_lines: string[];
  }>;
}

export interface LegalSource {
  id: string;
  title: string;
  short_name: string;
  source_type: string;
  issuing_authority?: string | null;
  official_url?: string | null;
  jurisdiction_id: string;
  is_verified: boolean;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content_markdown: string;
  jurisdiction_id?: string | null;
  is_published: boolean;
  updated_at?: string | null;
}

export interface LegalAidResource {
  id: string;
  name: string;
  category: string;
  description: string;
  official_url?: string | null;
  helpline_phone?: string | null;
  address?: string | null;
  jurisdiction_id?: string | null;
  is_verified: boolean;
}
