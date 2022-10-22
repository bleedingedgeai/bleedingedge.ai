/**
 * This is just to know where the code is running
 */
export enum Environment {
  dev = "dev",
  staging = "staging",
  prod = "prod",
  test = "test",
}

function getEnvironmentFromString(env: string | undefined) {
  switch (env) {
    case "test":
      return Environment.test;
    case "production":
      return Environment.prod;
    case "staging":
      return Environment.staging;
    case "dev":
    case "development":
    default:
      return Environment.dev;
  }
}

function getCurrentEnvironment() {
  return getEnvironmentFromString(process.env.NODE_ENV);
}

export enum OperatingSystem {
  Unknown = "Unknown",
  Windows = "Windows",
  MacOS = "MacOS",
  iOS = "iOS",
  Android = "Android",
  Linux = "Linux",
}

/**
 * Only for browser. For handling keyboard differences
 */
function getCurrentOS(): OperatingSystem {
  if (typeof window === "undefined") {
    return OperatingSystem.Unknown;
  }

  // https://stackoverflow.com/a/45368027

  const dataOS = [
    {
      string: window.navigator.platform,
      subString: "Win",
      identity: OperatingSystem.Windows,
    },
    {
      string: window.navigator.platform,
      subString: "Mac",
      identity: OperatingSystem.MacOS,
    },
    {
      string: window.navigator.userAgent,
      subString: "iPhone",
      identity: OperatingSystem.iOS,
    },
    {
      string: window.navigator.userAgent,
      subString: "iPad",
      identity: OperatingSystem.iOS,
    },
    {
      string: window.navigator.userAgent,
      subString: "iPod",
      identity: OperatingSystem.iOS,
    },
    {
      string: window.navigator.userAgent,
      subString: "Android",
      identity: OperatingSystem.Android,
    },
    {
      string: window.navigator.platform,
      subString: "Linux",
      identity: OperatingSystem.Linux,
    },
  ];

  for (const data of dataOS) {
    const dataString = data.string;
    if (dataString && dataString.indexOf(data.subString) !== -1) {
      return data.identity;
    }
  }

  return OperatingSystem.Unknown;
}

export const currentEnvironment = getCurrentEnvironment();
export const currentOS = getCurrentOS();

export const currentContext = {
  name: undefined,
};
