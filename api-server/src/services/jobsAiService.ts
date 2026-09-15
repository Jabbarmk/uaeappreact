// AI assistant for the Jobs module only: job-description generation/improvement
// and CV/candidate matching. Provider-independent — reads the OpenAI key from
// site_settings (admin-editable) and falls back to a rule-based mock when no
// key is configured, so the UI flows keep working in dev without any secret.
import { query, queryOne } from '../db/pool';

async function getOpenAiKey(): Promise<string> {
  try {
    const row = await queryOne<any>("SELECT setting_value FROM site_settings WHERE setting_key = 'openai_api_key'");
    return row?.setting_value || process.env.OPENAI_API_KEY || '';
  } catch {
    return process.env.OPENAI_API_KEY || '';
  }
}

async function logUsage(action: string, ok: boolean, meta?: Record<string, unknown>) {
  try {
    await query(
      'INSERT INTO ai_usage_logs (action, provider, ok, meta) VALUES (?,?,?,?)',
      [action, 'openai', ok ? 1 : 0, meta ? JSON.stringify(meta) : null]
    );
  } catch {
    // Logging must never break the AI flow.
  }
}

async function callOpenAI(key: string, systemPrompt: string, userPrompt: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.6,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`OpenAI ${res.status}: ${text.slice(0, 300)}`);
    }
    const data = await res.json() as any;
    return data.choices?.[0]?.message?.content?.trim() || '';
  } finally {
    clearTimeout(timeout);
  }
}

// ── Mock fallback (used when no API key is configured) ─────────────────────
function mockDescription(title: string, company: string): string {
  return `We are looking for a talented ${title || 'professional'}${company ? ` to join ${company}` : ''}. ` +
    `In this role you will contribute your skills and experience to help the team achieve its goals. ` +
    `[AI mock content — configure an OpenAI API key in Admin > Settings > AI Settings for real generated content.]`;
}

function mockList(kind: string, title: string): string {
  return `- [Mock ${kind} item 1 for ${title || 'this role'}]\n- [Mock ${kind} item 2]\n- [Mock ${kind} item 3]\n(Configure an OpenAI API key in Admin > Settings to get real AI-generated ${kind}.)`;
}

export interface JobContext {
  title?: string;
  company?: string;
  category?: string;
  location?: string;
  jobType?: string;
  experienceLevel?: string;
  existingDescription?: string;
}

async function withProvider(action: string, ctx: JobContext, systemPrompt: string, userPrompt: string, mockFn: () => string): Promise<{ text: string; provider: 'openai' | 'mock' }> {
  const key = await getOpenAiKey();
  if (!key) {
    await logUsage(action, true, { provider: 'mock', title: ctx.title });
    return { text: mockFn(), provider: 'mock' };
  }
  try {
    const text = await callOpenAI(key, systemPrompt, userPrompt);
    await logUsage(action, true, { provider: 'openai', title: ctx.title });
    return { text, provider: 'openai' };
  } catch (err: any) {
    await logUsage(action, false, { provider: 'openai', error: String(err?.message || err) });
    // Never fail the request outright — degrade to mock so the editor stays usable.
    return { text: mockFn(), provider: 'mock' };
  }
}

const GUARDRAILS = 'You are assisting with a job posting on a UAE business-directory app. ' +
  'Only use facts explicitly given to you. Do NOT invent company facts, salary figures, benefits, ' +
  'specific qualifications, work locations, or legal/visa requirements that were not provided. ' +
  'If information is missing, write generic role-appropriate content and leave specifics as placeholders like [X years]. ' +
  'Keep the tone professional and concise, suitable for a UAE job listing.';

export async function generateJobDescription(ctx: JobContext) {
  const userPrompt = `Write a job description for this role.\nTitle: ${ctx.title || 'N/A'}\nCompany: ${ctx.company || 'N/A'}\nCategory: ${ctx.category || 'N/A'}\nLocation: ${ctx.location || 'N/A'}\nJob type: ${ctx.jobType || 'N/A'}\nExperience level: ${ctx.experienceLevel || 'N/A'}`;
  return withProvider('generate_description', ctx, GUARDRAILS, userPrompt, () => mockDescription(ctx.title || '', ctx.company || ''));
}

export async function improveJobDescription(ctx: JobContext) {
  const userPrompt = `Improve the grammar, clarity and professionalism of this existing job description without changing its factual content:\n\n${ctx.existingDescription || ''}`;
  return withProvider('improve_description', ctx, GUARDRAILS, userPrompt, () => ctx.existingDescription || mockDescription(ctx.title || '', ctx.company || ''));
}

export async function generateResponsibilities(ctx: JobContext) {
  const userPrompt = `List 5-8 key responsibilities (as a bullet list, one per line starting with "-") for this role.\nTitle: ${ctx.title || 'N/A'}\nCategory: ${ctx.category || 'N/A'}`;
  return withProvider('generate_responsibilities', ctx, GUARDRAILS, userPrompt, () => mockList('responsibilities', ctx.title || ''));
}

export async function generateQualifications(ctx: JobContext) {
  const userPrompt = `List 5-8 required/preferred qualifications (as a bullet list, one per line starting with "-") for this role.\nTitle: ${ctx.title || 'N/A'}\nExperience level: ${ctx.experienceLevel || 'N/A'}`;
  return withProvider('generate_qualifications', ctx, GUARDRAILS, userPrompt, () => mockList('qualifications', ctx.title || ''));
}

export async function suggestSkills(ctx: JobContext) {
  const userPrompt = `Suggest 6-10 relevant skills (comma-separated, no explanation) for this role.\nTitle: ${ctx.title || 'N/A'}\nCategory: ${ctx.category || 'N/A'}`;
  return withProvider('suggest_skills', ctx, GUARDRAILS, userPrompt, () => `[Mock skills — configure an OpenAI API key] ${ctx.title || 'Communication'}, Teamwork, Problem Solving`);
}

export async function suggestJobTitles(ctx: JobContext) {
  const userPrompt = `Based on this job description, suggest 5 alternative professional job titles (comma-separated, no explanation):\n\n${ctx.existingDescription || ctx.title || ''}`;
  return withProvider('suggest_titles', ctx, GUARDRAILS, userPrompt, () => `[Mock titles] ${ctx.title || 'Specialist'}, Senior ${ctx.title || 'Specialist'}, ${ctx.title || 'Specialist'} II`);
}

export async function generateScreeningQuestions(ctx: JobContext) {
  const userPrompt = `Write 4-6 screening questions to ask candidates applying for this role (one per line starting with "-").\nTitle: ${ctx.title || 'N/A'}\nExperience level: ${ctx.experienceLevel || 'N/A'}`;
  return withProvider('generate_screening_questions', ctx, GUARDRAILS, userPrompt, () => mockList('screening questions', ctx.title || ''));
}

export async function generateSeoContent(ctx: JobContext) {
  const userPrompt = `Write an SEO-friendly meta title (max 60 chars) and meta description (max 155 chars) for this job listing, labeled "Title:" and "Description:".\nTitle: ${ctx.title || 'N/A'}\nCompany: ${ctx.company || 'N/A'}\nLocation: ${ctx.location || 'N/A'}`;
  return withProvider('generate_seo', ctx, GUARDRAILS, userPrompt, () => `Title: ${ctx.title || 'Job'} at ${ctx.company || 'a UAE company'}\nDescription: [Mock SEO description — configure an OpenAI API key for real content.]`);
}

// ── Candidate matching (used by ATS screening, Phase 4) ─────────────────────
export interface MatchContext {
  jobTitle: string;
  jobDescription: string;
  jobRequirements: string;
  candidateSkills: string;
  candidateExperience: string;
  candidateSummary: string;
}

const MATCH_GUARDRAILS = 'You are assisting a recruiter by comparing a candidate profile to a job. ' +
  'Base your answer only on the text given. Do not consider or mention race, religion, gender, disability, age, ' +
  'nationality, or any other protected characteristic. Respond ONLY with strict JSON matching this shape: ' +
  '{"matchScore": number (0-100), "matchingSkills": string[], "missingSkills": string[], "experienceSummary": string, "suggestedQuestions": string[]}';

export async function matchCandidate(ctx: MatchContext) {
  const userPrompt = `Job title: ${ctx.jobTitle}\nJob description: ${ctx.jobDescription}\nJob requirements: ${ctx.jobRequirements}\n\nCandidate skills: ${ctx.candidateSkills}\nCandidate experience: ${ctx.candidateExperience}\nCandidate summary: ${ctx.candidateSummary}`;
  const { text, provider } = await withProvider('match_candidate', { title: ctx.jobTitle }, MATCH_GUARDRAILS, userPrompt, () => JSON.stringify({
    matchScore: 50,
    matchingSkills: [],
    missingSkills: [],
    experienceSummary: '[Mock match — configure an OpenAI API key in Admin > Settings for real AI matching.]',
    suggestedQuestions: [],
  }));
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    return { ...parsed, provider };
  } catch {
    return { matchScore: null, matchingSkills: [], missingSkills: [], experienceSummary: text, suggestedQuestions: [], provider };
  }
}
