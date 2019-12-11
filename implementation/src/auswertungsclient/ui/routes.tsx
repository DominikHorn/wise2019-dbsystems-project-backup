import * as H from "history";
import * as React from "react";
import { RouteChildrenProps, RouteComponentProps } from "react-router";
import { WidgetType } from "./components/general/statistikwidgets/WidgetTypes";

export interface IRouteProps {
  readonly path: string;
  readonly location?: H.Location;
  readonly exact?: boolean;
  readonly sensitive?: boolean;
  readonly strict?: boolean;
  readonly component?: React.ComponentType<RouteComponentProps<any>>;
  readonly render?: (props: RouteComponentProps<any>) => React.ReactNode;
  readonly children?:
    | ((props: RouteChildrenProps<any>) => React.ReactNode)
    | React.ReactNode;
}

export interface ISubRoute {
  readonly title: string;
  readonly key: string;
  readonly path: string;
}

export interface IMenuRoute extends IRouteProps {
  readonly menuKey: string;
  readonly menuTitle: string;
  readonly menuIconIdentifier: string;

  // If valid, subpaths that will be displayed as submenu entries
  readonly possibleSubroutes?: ISubRoute[];
}

export const PRECONFIGURED_WIDGET_ROUTES: IMenuRoute[] = [
  {
    menuKey: "Empty",
    menuTitle: "Neues Layout",
    menuIconIdentifier: "delete",
    path: `/`
  },
  {
    menuKey: "Ergebnisse",
    menuTitle: "Ergebnisse",
    menuIconIdentifier: "pie-chart",
    path: `/${btoa(
      encodeURIComponent(
        JSON.stringify([
          {
            type: "Mandatliste (Q2)",
            layout: {
              w: 6,
              h: 20,
              x: 0,
              y: 0,
              i: "0",
              minW: 4,
              minH: 4
            }
          },
          {
            type: "Sitzverteilung (Q1) - Torte",
            layout: {
              w: 6,
              h: 10,
              x: 6,
              y: 0,
              i: "1",
              minW: 4,
              minH: 4
            }
          },
          {
            type: "Überhangmandate (Q5)",
            layout: {
              w: 6,
              h: 10,
              x: 6,
              y: 10,
              i: "2",
              minW: 4,
              minH: 4
            }
          }
        ])
      )
    )}`
  }
];
