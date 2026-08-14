import type { AdapterResult } from "./types";
import type { Platform } from "../platform";
import { genericAdapter } from "./generic";
import { directoryAdapter } from "./directory";
import { institutionalAdapter } from "./institutional";
import { googleSearchAdapter } from "./googleSearch";
import { googleMapsAdapter } from "./googleMaps";
import { linkedinAdapter } from "./linkedin";
import { olxAdapter } from "./olx";

export function runAdapter(platform: Platform): AdapterResult {
  switch (platform) {
    case "google_search":
      return googleSearchAdapter();
    case "google_maps":
      return googleMapsAdapter();
    case "linkedin":
      return linkedinAdapter();
    case "olx":
      return olxAdapter();
    case "directory":
      return directoryAdapter();
    case "institutional":
      return institutionalAdapter();
    default:
      return genericAdapter();
  }
}
