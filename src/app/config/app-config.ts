export interface ApplicationConfiguration{
  hostname : string,
  qgisServerUrl : string,
  qgisServerProjectFolder : string,
  imageUploadService: string,
  imageUploadFolder: string,
  projectConfigurationFile: string,
  wmsVersion:  string,
  wfsVersion: string,
  srs: string,
  requireAuth?: boolean,
  protectedBackendUrls?: string[],
  auth?: {
    issuer: string,
    clientId: string,
    adminRole?: string,
    rolesClaim?: string,
    customQueryParams?: Record<string, string>,
  }
}
