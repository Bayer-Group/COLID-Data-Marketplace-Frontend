export const environment = {
  Label: 'Docker',
  production: true,
  allowAnonymous: true,
  interceptors: [],
  pageSize: 10,
  dmpCoreApiUrl: 'http://localhost:51800/api/',
  appDataApiUrl: 'http://localhost:51810/api',
  colidApiUrl: 'http://localhost:51770/api/v3',
  loggingUrl: 'http://localhost:51800/api/log',
  releaseNotesUrl: 'https://placeholder.org/',
  adalConfig: {
    authority: "yourdomain.onmicrosoft.com",
    clientId: '<data marketplace client id>',
    redirectUri: 'http://localhost:4300/logged-in',
    protectedResourceMap: {
      'http://localhost:51800': ['<search service client id>/Resource.Search.All'],
      'http://localhost:51810': ['<appdata service client id>/UserData.ReadWrite'],
      'http://localhost:51770': ['<registration service client id>/Resource.Read.All']
    },
    postLogoutRedirectUri: 'http://localhost:4300/'
  },
  appSupportFeedBack: {
    mailToLink: 'mailTo:none',
    supportTicketLink: 'http://placeholder.url/'
  },
  build: {
    ciJobId: '$BUILD_CIJOBID',
    ciPipelineId: '$BUILD_CIPIPELINEID',
    ciCommitSha:  '$BUILD_CICOMMITSHA',
  },
  pidUrl: 'http://localhost:4200/',
  kgeUrl: 'http://localhost:4400/'
};
