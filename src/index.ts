import { hostname } from "os";
import { existsSync } from "fs";
// browser bundle will not have fs module working as browserify does not support fs

/**
 * Returns the hostname of current OS
 * @returns Current hostname of currently running OS
 */
export function getHostName(): string {
  const hName: string = hostname();
  return hName;
}

/**
 * Checks if the directory name inputted exists in the system or not
 * @param dirname The directory name input to check if it exists in the system or not
 * @returns true if the directory exists else false
 */
export function checkDirExists(dirname: string): boolean {
  return existsSync(dirname);
}
