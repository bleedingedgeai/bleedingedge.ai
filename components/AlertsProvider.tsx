import React, { useCallback, useReducer } from "react";
import { Icon } from "./Icons/types";

export type Id = string;
export type Callback = () => void;

export type AlertContent = {
  icon?: Icon;
  text: string | React.ReactElement;
  alignment?: "left" | "center";
};

export type Options = {
  duration?: number;
  autoDismiss?: boolean;
  onDismiss?: Callback;
  dynamicWidth?: boolean;
};

export type ShowAlertFn = (content: AlertContent, options?: Options) => Alert;
export type UpdateAlertFn = (
  id: Id,
  content: AlertContent,
  options?: Options
) => Alert;
export type HideAlertFn = (id?: Id) => void;

export type HoverFn = () => void;

export type Alert = Options & {
  content: AlertContent;
  id: Id;
  hideAlert: () => void;
};

export type Alerts = Alert[];

export type Context = {
  showAlert: ShowAlertFn;
  updateAlert: UpdateAlertFn;
  hideAlert: HideAlertFn;
  alerts: Alerts;
};

type Action = {
  type: "show" | "update" | "hide";
  payload: any;
};

function alertsReducer(alerts: Alerts, action: Action) {
  switch (action.type) {
    case "show":
      return [
        {
          ...action.payload.alert,
          id: alerts[0]?.id || action.payload.alert.id,
        },
      ];
    case "update":
      return alerts.map((alert) => {
        if (alert.id === action.payload.alert.id) {
          return { ...alert, ...action.payload.alert };
        }
        return alert;
      });
    case "hide":
      if (action.payload.id) {
        return alerts.filter((alert) => alert.id !== action.payload.id);
      }

      const newAlerts = alerts.slice();
      newAlerts.pop();
      return newAlerts;
    default:
      return alerts;
  }
}

export const AlertsContext = React.createContext<Partial<Context>>({});

export default function AlertsProvider(props: React.PropsWithChildren<{}>) {
  const [alerts, dispatch] = useReducer(alertsReducer, []);

  const hideAlert = useCallback(
    (id?: Id) => {
      dispatch({ type: "hide", payload: { id } });
    },
    [dispatch]
  );

  const updateAlert = useCallback(
    (id, content: AlertContent, options?: Options): Alert => {
      const alert = Object.assign(
        {},
        { content, id, hideAlert: () => hideAlert(id) },
        options
      );
      dispatch({ type: "update", payload: { alert } });

      return alert;
    },
    [dispatch, hideAlert]
  );

  const showAlert = useCallback(
    (content: AlertContent, options?: Options): Alert => {
      const id = Date.now().toString();
      const alert = Object.assign(
        {},
        { content, id, hideAlert: () => hideAlert(id) },
        options
      );
      dispatch({ type: "show", payload: { alert } });

      return alert;
    },
    [hideAlert, dispatch]
  );

  return (
    <AlertsContext.Provider
      value={{ showAlert, updateAlert, hideAlert, alerts }}
    >
      {props.children}
    </AlertsContext.Provider>
  );
}
