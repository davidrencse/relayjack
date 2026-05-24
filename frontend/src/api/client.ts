import type { AuditEvent, CreateJobRequest, CreateTargetRequest, ExportBundleRecord, OperatorRole, OperatorSession, PluginDefinition, PluginRunRecord, RelayJob, SessionRecord, TargetAllowlistEntry, UpdateTargetRequest, ValidateJobRequest, ValidateJobResponse } from '../types';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

export class ApiClientError extends Error {
  code: string;
  status: number;
  details?: Record<string, unknown>;
  constructor(message: string, status: number, code = 'api_error', details?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type Query = Record<string, string | number | boolean | undefined | null>;

function qs(query?: Query): string {
  if (!query) return '';
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value));
  });
  const text = params.toString();
  return text ? `?${text}` : '';
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers, credentials: 'include' });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const err = data?.error || data;
    throw new ApiClientError(err?.message || `Request failed with ${response.status}`, response.status, err?.code || 'http_error', err?.details);
  }
  return data as T;
}

export const api = {
  health: () => request<{ status: 'ok'; time: string; wsClients: number }>('/api/health'),
  acknowledge: (body: { operatorId: string; displayName: string; role: OperatorRole; consentAcknowledged: boolean; acknowledgedAt: string }) => request<{ session: OperatorSession }>('/api/session/acknowledge', { method: 'POST', body: JSON.stringify(body) }),
  listAllowlist: (query: { status?: string; search?: string; page?: number; pageSize?: number }) => request<{ items: TargetAllowlistEntry[]; total: number }>(`/api/allowlist${qs(query)}`),
  createTarget: (body: CreateTargetRequest) => request<{ item: TargetAllowlistEntry }>('/api/allowlist', { method: 'POST', body: JSON.stringify(body) }),
  updateTarget: (targetId: string, body: UpdateTargetRequest) => request<{ item: TargetAllowlistEntry }>(`/api/allowlist/${encodeURIComponent(targetId)}`, { method: 'PATCH', body: JSON.stringify(body) }),
  importTargets: (records: CreateTargetRequest[]) => request<{ accepted: number; rejected: Array<{ index: number; reason: string }>; createdIds: string[] }>('/api/allowlist/import', { method: 'POST', body: JSON.stringify({ records }) }),
  revokeTarget: (targetId: string, reason: string) => request<{ item: TargetAllowlistEntry }>(`/api/allowlist/${encodeURIComponent(targetId)}/revoke`, { method: 'POST', body: JSON.stringify({ reason }) }),
  listJobs: (query: { status?: string; targetId?: string; page?: number; pageSize?: number }) => request<{ items: RelayJob[]; total: number }>(`/api/jobs${qs(query)}`),
  validateJob: (body: ValidateJobRequest) => request<ValidateJobResponse>('/api/jobs/validate', { method: 'POST', body: JSON.stringify(body) }),
  createJob: (body: CreateJobRequest) => request<{ job: RelayJob }>('/api/jobs', { method: 'POST', body: JSON.stringify(body) }),
  getJob: (jobId: string) => request<{ job: RelayJob; session: SessionRecord | null; events: AuditEvent[] }>(`/api/jobs/${encodeURIComponent(jobId)}`),
  jobAction: (jobId: string, action: 'start' | 'pause' | 'resume' | 'terminate', reason: string) => request<{ job: RelayJob; cleanup?: { requested: boolean; summary: string } }>(`/api/jobs/${encodeURIComponent(jobId)}/${action}`, { method: 'POST', body: JSON.stringify({ reason }) }),
  shutdown: (reason: string) => request<{ terminatedJobIds: string[]; cleanupRequested: boolean; auditEventId: string }>('/api/jobs/shutdown', { method: 'POST', body: JSON.stringify({ reason, confirm: true }) }),
  listPlugins: () => request<{ items: PluginDefinition[] }>('/api/plugins'),
  validatePlugin: (pluginId: string, body: { jobId: string; targetId: string; parameters: Record<string, string> }) => request<{ valid: boolean; issues: Array<{ code: string; message: string }> }>(`/api/plugins/${encodeURIComponent(pluginId)}/validate`, { method: 'POST', body: JSON.stringify(body) }),
  runPlugin: (pluginId: string, body: { jobId: string; targetId: string; parameters: Record<string, string>; reason: string }) => request<{ run: PluginRunRecord }>(`/api/plugins/${encodeURIComponent(pluginId)}/run`, { method: 'POST', body: JSON.stringify(body) }),
  listAudit: (query: { jobId?: string; operatorId?: string; type?: string; from?: string; to?: string; page?: number; pageSize?: number }) => request<{ items: AuditEvent[]; total: number }>(`/api/audit${qs(query)}`),
  createExport: (body: { jobIds: string[]; includeAudit: boolean; includeMetadata: boolean; includeNotes: boolean; noteSections: string[] }) => request<{ exportId: string; status: 'ready'; summary: { jobCount: number; auditEventCount: number } }>('/api/exports', { method: 'POST', body: JSON.stringify(body) }),
  getExport: (exportId: string) => request<{ export: ExportBundleRecord }>(`/api/exports/${encodeURIComponent(exportId)}`)
};
