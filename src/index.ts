import { hostname } from "os";

export function getHostName(): string {
  const host_name: string = hostname();
  return host_name;
}
