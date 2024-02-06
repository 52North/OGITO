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
  auth?: {
    domain: string,
    clientId: string,
  }
}
