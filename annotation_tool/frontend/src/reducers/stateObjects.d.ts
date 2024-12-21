interface CodingProgressStateObject {
  company_name: string;
  name: string;
  response_count: number;
  target_count: number;
  created: string;
}

interface ModelState {
  policies: { [id: number]: Policy };
  policy_instances: { [id: number]: PolicyInstance };
  codings: { [id: number]: Coding };
  coding_instances: { [id: number]: CodingInstance };
  assignment: Assignment;
}

interface LocalState {
  selectedQuestion: number;
  selectedQuestionIdentifier: number;
  localCoding: CodingInstance;
  updateSinceLastSave: boolean;
}

interface QuestionAnswer {
  values: { [id: string]: [selected: boolean] };
  sentences: {
    privacy_policy: { [paragraphIndex: number]: [sentenceIndcies: number[]] };
    tos: { [paragraphIndex: number]: [sentenceIndcies: number[]] };
    ccpa_policy: { [paragraphIndex: number]: [sentenceIndcies: number[]] };
    gdpr_policy: { [paragraphIndex: number]: [sentenceIndcies: number[]] };
  };
  comment: string;
  confidence: Null | number;
}

interface QuestionOption {
  label: string;
  value: string;
  details: ?string;
}

interface Category {
  label: string;
  notes: { string: string };
  id: string;
  info: string;
  questions: Question[];
}

interface Question {
  info: string;
  type: string;
  values: QuestionOption[];
  description: string;
  meta: Object;
}

// ********* Server-side MODEL OBJECTS *************** //
interface Assignment {
  id: number;
  project: number;
  created_dt: string; //date string
  coder_email: string;
  url: string;
  label: string;
  notes: {};
  due_dt: string; //date string
  completed_dt: string; //date string
  type: number;
  status: string;
}
interface AssignmentType {
  id: number;
  project: number;
  fields: string[];
  name: string;
}
interface Coding {
  id: number;
  project: number;
  parent: number;
  created_dt: string; //date string
  questions: Question[];
}
interface CodingInstance {
  id: number;
  project: number;
  coder_email: string;
  policy_instance_id: number;
  coding_id: number;
  created_dt: string; //date string
  coding_values: {};
}
interface Policy {
  id: number;
  project: number;
  company_name: string;
  site_name: string;
  alexa_rank: number;
  urls: {};
  start_date: Date;
  end_date: Date;
  last_scan_dt: string; //date string
  scan_count: number;
  categories: {};
  meta: {};
}
interface PolicyInstance {
  id: number;
  project: number;
  policy_id: number;
  raw_policy_id: number;
  scan_dt: string; //date string
  content: {};
}
interface RawPolicyInstance {
  id: number;
  project: number;
  policy_id: number;
  raw_content_blocks: {};
  capture_date: Date;
  capture_source: Text;
}
interface TimingSession {
  id: number;
  project: number;
  coder_email: string;
  coding_id: number;
  policy_instance_id: number;
  question_timings: {};
  session_timing: {};
  session_identifier: number;
}
