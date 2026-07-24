import { env } from "@/lib/env";

export function toAbsoluteUploadUrl(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }
  return `${env.apiOrigin}${path}`;
}
