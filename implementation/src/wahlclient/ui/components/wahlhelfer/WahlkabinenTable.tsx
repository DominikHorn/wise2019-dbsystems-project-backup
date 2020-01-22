import * as React from "react";
import { compose } from "react-apollo";
import {
  withRegisteredWahlkabinen,
  QueryToGetRegisteredWahlkabinenHOCProps
} from "../../../../client-graphql/wahlkabine/getRegisteredWahlkabinenQuery";
import {
  withRegisterWahlkabineMutation,
  MutationToRegisterWahlkabineHOCProps
} from "../../../../client-graphql/wahlkabine/registerWahlkabineMutation";
import {
  Table,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Alert,
  message,
  Input
} from "antd";
import {
  withRemoveWahlkabineMutation,
  MutationToRemoveWahlkabineHOCProps
} from "../../../../client-graphql/wahlkabine/removeWahlkabineMutation";
import * as QrReader from "react-qr-reader";
import Password from "antd/lib/input/Password";
import { FormComponentProps } from "antd/lib/form";

export interface IWahlkabinenTableProps {
  readonly wahlhelferAuth: string;
}

interface IWahlkabinenFormData {
  readonly label: string;
  readonly token: string;
}

interface IFormProps
  extends IWahlkabinenTableProps,
    FormComponentProps<IWahlkabinenFormData> {}

interface IProps
  extends IFormProps,
    QueryToGetRegisteredWahlkabinenHOCProps,
    MutationToRegisterWahlkabineHOCProps,
    MutationToRemoveWahlkabineHOCProps {}

interface IState {
  readonly modalVisible: boolean;
  readonly qrCodeError?: Error;
}

class WahlkabinenTableComponent extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      modalVisible: false
    };
  }

  private onQrReaderError = (qrCodeError: Error) =>
    this.setState({ qrCodeError });

  private onQrReaderScan = (token?: string) => {
    if (!token) return;
    message.success("Token erfolgreich ausgelesen");
    this.props.form.setFieldsValue({ token });
  };

  private registerWahlkabine = (e: React.FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Form values:", values);
      }
    });
  };

  private renderTokenInput = () => (
    <>
      <Row
        type={"flex"}
        justify={"start"}
        gutter={[16, 16]}
        style={{ marginBottom: "8px" }}
      >
        <Col span={10}>
          <QrReader
            onError={this.onQrReaderError}
            onScan={this.onQrReaderScan}
            style={{ width: "100%", height: "100%" }}
          />
        </Col>
        <Col span={14}>
          <div style={{ lineHeight: "1.2", textAlign: "justify" }}>
            Bitte halten Sie den von der betreffenden Wahlkabine generierten
            QR-Code in den markierten Bereich oder geben das Token hier ein:
          </div>
          {this.props.form.getFieldDecorator<IWahlkabinenFormData>("token", {
            rules: [
              {
                required: true,
                message: "Der Token der Wahlkabine ist zwingend erforderlich"
              }
            ]
          })(<Password placeholder={"Bitte Token eingeben"} />)}
        </Col>
      </Row>
      {this.state.qrCodeError && (
        <Alert
          type={"error"}
          message={`Auslesen des Tokens fehlgeschlagen: ${this.state.qrCodeError.message}`}
        />
      )}
    </>
  );

  private renderRegisterWahlkabineModal = () => {
    if (!this.state.modalVisible) {
      // This is to close camera stream when modal is not visible
      return <></>;
    }

    const { getFieldDecorator } = this.props.form;

    return (
      <Modal
        visible={this.state.modalVisible}
        onCancel={() => this.setState({ modalVisible: false })}
        onOk={this.registerWahlkabine}
      >
        <Form onSubmit={this.registerWahlkabine}>
          <Form.Item label={"Bezeichnung"} required={true}>
            {getFieldDecorator<IWahlkabinenFormData>("label", {
              rules: [
                {
                  required: true,
                  message: "Jede Wahlkabine muss eine Bezeichnung haben"
                }
              ]
            })(<Input placeholder={"Bitte eine Bezeichnung eingeben"} />)}
          </Form.Item>
          <Form.Item label={"Authentifizierung"} required={true}>
            {this.renderTokenInput()}
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  private renderTable = () => (
    <Table
      size={"small"}
      title={() => (
        <Row type={"flex"} gutter={[16, 16]} align={"middle"}>
          <Col>Authorisierte Wahlkabinen</Col>
          <Col>
            <Button
              icon={"plus"}
              type={"primary"}
              onClick={() => this.setState({ modalVisible: true })}
            >
              Neue Wahlkabine Authorisieren
            </Button>
          </Col>
        </Row>
      )}
      loading={this.props.registeredWahlkabinenData.loading}
      columns={[
        { title: "Label", key: "label", dataIndex: "label" },
        {
          title: "Manage",
          key: "manage",
          render: wahlkabine => (
            <Row
              type={"flex"}
              gutter={[8, 8]}
              justify={"center"}
              align={"middle"}
            >
              <Col>
                <Button type={"danger"} icon={"delete"} />
              </Col>
            </Row>
          )
        }
      ]}
      dataSource={this.props.registeredWahlkabinenData.wahlkabinen}
    />
  );

  render() {
    const { registeredWahlkabinenData } = this.props;
    if (!registeredWahlkabinenData) return <></>;

    return (
      <>
        {this.renderTable()}
        {this.renderRegisterWahlkabineModal()}
      </>
    );
  }
}

const WahlkabinenTableWithQueries = compose(
  withRegisterWahlkabineMutation(),
  withRemoveWahlkabineMutation(),
  withRegisteredWahlkabinen<IWahlkabinenTableProps>(p => p.wahlhelferAuth)
)(WahlkabinenTableComponent);

const WahlkabinenTableWithForm = Form.create<IFormProps>()(
  WahlkabinenTableWithQueries
);

export const WahlkabinenTable = WahlkabinenTableWithForm as React.ComponentType<
  IWahlkabinenTableProps
>;
