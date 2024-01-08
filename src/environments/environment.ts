export const environment = {
  Label: "Local",
  production: false,
  environment: "dev",
  allowAnonymous: true,
  interceptors: [],
  pageSize: 10,
  dmpCoreApiUrl: "http://localhost:51801/api/",
  appDataApiUrl: "http://localhost:51811/api",
  colidApiUrl: "http://localhost:51770/api/v3",
  loggingUrl: "http://localhost:51800/api/log",
  dmpUrl: "http://localhost:4300/",
  releaseNotesUrl: "https://info.dev.colid.int.bayer.com/current_release_notes.md",
  adalConfig: {
    authority: "yourdomain.onmicrosoft.com",
    clientId: "<data marketplace client id>",
    redirectUri: "http://localhost:4301/logged-in",
    protectedResourceMap: {
      "http://localhost:51800": [
        "<search service client id>/Resource.Search.All",
      ],
      "http://localhost:51810": [
        "<appdata service client id>/UserData.ReadWrite",
      ],
      "http://localhost:51770": [
        "<registration service client id>/Resource.Read.All",
      ],
      "https://placeholder.org/": [
        "<agent squirrel client id>/Read.All",
      ],
    },
    postLogoutRedirectUri: "http://localhost:4301/",
  },
  PidUriTemplate: {
    BaseUrl: "https://pid.bayer.com/",
  },
  appSupportFeedBack: {
    mailToLink: "mailTo:none",
    supportTicketLink: "http://placeholder.url/",
  },
  build: {
    ciJobId: "$BUILD_CIJOBID",
    ciPipelineId: "$BUILD_CIPIPELINEID",
    ciCommitSha: "$BUILD_CICOMMITSHA",
  },
  pidUrl: "http://localhost:4200/",
  kgeUrl: "https://kge.example.com/",
  rrmUrl: "http://localhost:4305/",
  colidIconsUrl: "https://dataservices-icons.dev.colid.int.bayer.com/",
  cookieSharingSubDomain: "localhost",
  baseUrl: "bayer.com",
  deploymentInfoUrl:
    "https://info.dev.colid.int.bayer.com/current_deployment.json",
  agentStatisticsApi: "https://placeholder.org/",
};
