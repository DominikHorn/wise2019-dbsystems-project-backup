import * as React from "react";
import { Card, Button } from "antd";
import { withErrorBoundary } from "./ErrorBoundary";
import { renderError } from "../../guiUtil";
import "./StatistikWidget.css";

export interface IStatistikWidgetProps<State> {
  readonly title?: string | React.ReactNode;
  readonly children?: React.ReactNode;
  readonly removeWidget?: () => void;
  readonly routableState?: State;
  readonly setRoutableState?: (newState: Partial<State>) => void;
  readonly titleHeight?: string;
}

interface IProps extends IStatistikWidgetProps<{}> {}

const StatistikWidgetComponent = (props: IProps) => (
  <Card
    className={"statistik-card"}
    title={props.title}
    extra={
      props.removeWidget && (
        <Button
          shape={"circle"}
          size={"small"}
          type={"danger"}
          icon={"close"}
          onClick={props.removeWidget}
        />
      )
    }
    style={{ width: "100%", height: "100%" }}
    bodyStyle={{
      width: "100%",
      height:
        props.title || props.removeWidget
          ? `calc(100% - ${props.titleHeight || "55px"})`
          : "100%",
      overflow: "hidden"
    }}
  >
    {props.children}
  </Card>
);

const StatistikWidgetWithErrorBoundary = withErrorBoundary<
  IStatistikWidgetProps<{}>
>(StatistikWidgetComponent, error => <Card>{renderError(error.message)}</Card>);

export const StatistikWidget = StatistikWidgetWithErrorBoundary as React.ComponentType<
  IStatistikWidgetProps<{}>
>;
