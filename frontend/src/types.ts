export type OperatorRole = 'viewer' | 'operator' | 'admin';
export type TargetStatus = 'approved' | 'revoked';
export type JobStatus = 'draft' | 'queued' | 'validating' | 'ready' | 'running' | 'paused' | 'completed' | 'terminated' | 'failed';
export type SessionState = 'pending' | 'active' | 'closed';
export type Permission = 'allowlist:read' | 'allowlist:write' | 'jobs:read' | 'jobs:write' | 'plugins:read' | 'plugins:run' | 'audit:read' | 'exports:write' | 'shutdown:execute';

export interface ApiError { code: string; message: string; details?: Record<string, unknown>; }
export interface OperatorSession { operatorId: string; displayName: string; role: OperatorRole; consentAcknowledged: boolean; lastAcknowledgedAt: string; permissions: Permission[]; }
export interface TargetAllowlistEntry { targetId: string; hostname: string; address: string; protocol: string; port: number; scopeTag: string; status: TargetStatus; notes: string; createdAt: string; updatedAt: string; expiresAt: string | null; revokedReason?: string; }
export interface CreateTargetRequest { hostname: string; address: string; protocol: string; port: number; scopeTag: string; notes: string; expiresAt: string | null; }
export type UpdateTargetRequest = Partial<CreateTargetRequest>;
export interface RelayJob { jobId: string; targetId: string; name: string; transportProfile: string; requestedModules: string[]; notes: string; status: JobStatus; createdAt: string; updatedAt: string; createdBy: string; lastError: string | null; }
export interface ValidateJobRequest { targetId: string; name: string; transportProfile: string; requestedModules: string[]; notes: string; }
export interface ValidateJobResponse { valid: boolean; issues: Array<{ code: string; message: string; severity: 'error' | 'warning' }>; }
export interface CreateJobRequest extends ValidateJobRequest { startMode: 'queued' | 'draft'; }
export interface SessionRecord { sessionId: string; jobId: string; state: SessionState; capturedMetadata: Record<string, string>; startedAt?: string; endedAt?: string; }
export interface AuditEvent { eventId: string; timestamp: string; operatorId: string; jobId: string | null; targetId: string | null; type: string; message: string; details: Record<string, unknown>; }
export interface PluginDefinition { pluginId: string; name: string; description: string; allowedTargetProtocols: string[]; requiresActiveSession: boolean; supportsDryRun: boolean; riskNotes: string[]; }
export interface PluginRunRecord { runId: string; pluginId: string; jobId: string; targetId: string; parameters: Record<string, string>; status: 'accepted' | 'rejected' | 'completed' | 'failed'; startedAt: string; completedAt?: string; resultSummary?: string; }
export interface ExportBundleRecord { exportId: string; jobIds: string[]; includeAudit: boolean; includeMetadata: boolean; includeNotes: boolean; createdAt: string; summary: { jobCount: number; auditEventCount: number }; bundle: { jobs: unknown[]; auditEvents: unknown[]; notes: unknown[] }; }
export interface WsServerEvent { channel: 'job.updated' | 'session.updated' | 'audit.created' | 'shutdown.completed' | 'sync.notice'; payload: Record<string, unknown>; timestamp: string; }
