import { Alert, Col, Divider, Icon, Row, Spin, Tooltip } from "antd";
import { AlertProps } from "antd/lib/alert";
import * as React from "react";
import "./guiUtil.css";

export const renderCenteredLoading = () => (
  <Icon
    className={"gui-util-centered-loading"}
    type={"loading-3-quarters"}
    spin={true}
  />
);

export const renderHelp = (content: string) => (
  <Tooltip title={content}>
    <Icon type={"question-circle-o"} />
  </Tooltip>
);

export const renderRichHelp = (content: React.ReactNode) => (
  <Tooltip
    title={content}
    overlayStyle={{ minWidth: "80%", maxHeight: "0.5vh" }}
  >
    <Icon type={"question-circle-o"} />
  </Tooltip>
);

export const renderWithEllipsisAndTooltip = (msg: string, width?: number) => (
  <Tooltip title={msg}>
    <div className={"gui-util-text-with-ellipsis"} style={width && { width }}>
      {msg}
    </div>
  </Tooltip>
);

export const renderError = (
  message: string,
  title: string = "The following error occured while rendering:"
) => (
  <Alert
    message={title}
    description={
      <>
        <Row>{`"${message}"`}</Row>
        <Divider />
        <Row>
          <Col span={16}>
            {"Please report this error at this project's "}
            {renderRepoLink()}
          </Col>
          <Col span={8} style={{ textAlign: "right" }}>
            {"Please also try "}
            <a href=".">reloading</a>
            {" the page."}
          </Col>
        </Row>
      </>
    }
    type={"error"}
    showIcon={true}
    style={{
      margin: "5px"
    }}
  />
);

export const renderRepoLink = (label: string = "gitlab repo") => (
  <a
    href={"https://gitlab.itestra.com/horn/labeling-platfrom-bachelorarbeit/"}
    target={"_blank"}
  >
    {label}
  </a>
);

export const renderLoadingSpinner = (tip: string = "") => <Spin tip={tip} />;

export const renderLoading = () => (
  <Icon type={"loading-3-quarters"} spin={true} />
);

const renderAlert = (
  message: string,
  type?: AlertProps["type"],
  title?: string,
  showIcon: boolean = true
) => (
  <Alert
    message={title}
    description={message}
    type={type}
    showIcon={showIcon}
    style={{
      margin: "5px"
    }}
  />
);

export const renderInfo = (message: string, title: string = "Info") =>
  renderAlert(message, "info", title);
export const renderWarning = (message: string, title: string = "Warning") =>
  renderAlert(message, "warning", title);
