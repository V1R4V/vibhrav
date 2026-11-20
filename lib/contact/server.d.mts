export interface ContactDependencies {
  env?: Record<string, string | undefined>;
  now?: () => number;
  fetch?: typeof fetch;
  rateLimit?: (input: { nonce: string; ipHash: string; digest: string }) => Promise<{ status: 'allowed' | 'limited' | 'replay'; retryAfter?: number }>;
}
export function issueChallenge(secret: string, now?: number): string;
export function verifyChallenge(token: unknown, secret: string, now?: number): { nonce: string } | null;
export function createContactHandlers(options?: ContactDependencies): {
  GET(request: Request): Promise<Response>;
  POST(request: Request): Promise<Response>;
};
