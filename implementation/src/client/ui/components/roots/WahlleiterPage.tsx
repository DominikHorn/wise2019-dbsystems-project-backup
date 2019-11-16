import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Card, message, Button, Col, Row, Modal, Form } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { GetFieldDecoratorOptions } from "antd/lib/form/Form";
import { FilePickerComponent } from "../general/FilePickerComponent";
import { compose } from "react-apollo";
import {
  withImportCSVDataMutation,
  IImportCSVDataMutationHocProps
} from "../../../graphql/wahlleiter/importCSVDataMutation";
import { UploadFile } from "antd/lib/upload/interface";

export interface IWahlleiterPageProps {
  routeProps: RouteComponentProps<any>;
}

interface IProps
  extends IWahlleiterPageProps,
    FormComponentProps,
    IImportCSVDataMutationHocProps {}

interface IState {
  modalVisible: boolean;
  uploadLoading: boolean;
}

class WahlleiterPageComponent extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      modalVisible: false,
      uploadLoading: false
    };
  }

  private onCancel = () =>
    this.setState({ modalVisible: false }, this.props.form.resetFields);

  private handleSubmit = (e: React.FormEvent<any>) => {
    // No further propagation
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ uploadLoading: true });
        this.props
          .importCSVData({
            files: values.files.map((f: UploadFile) => f.originFileObj)
          })
          .then(res => {
            this.setState({ uploadLoading: false });
            if (res && res.data.success) {
              this.setState({ modalVisible: false });
              this.props.form.resetFields();
              message.success(
                `Successfully imported CSV file${
                  values.files.length > 0 ? "s" : ""
                }`
              );
            } else {
              message.error(`Server refused to import CSV File`);
            }
          })
          .catch(error => {
            this.setState({ uploadLoading: false });
            message.error(`Failed to import CSV file: ${error.message}`);
          });
      }
    });
  }

  private renderUploadForm = (
    getFieldDecorator: <T extends Object = {}>(
      id: keyof T,
      options?: GetFieldDecoratorOptions
    ) => (node: React.ReactNode) => React.ReactNode
  ) => (
    <Form onSubmit={this.handleSubmit}>
      <Form.Item label={"Files"}>
        {getFieldDecorator("files", {
          rules: [{ required: true, message: "Please add files" }],
          valuePropName: "fileList"
        })(
          <FilePickerComponent
            accept={`.csv`}
            multiple={true}
            placeholder={`Drag & Drop or click to choose CSV files`}
          />
        )}
      </Form.Item>
    </Form>
  );

  private renderUploadModal = (
    getFieldDecorator: <T extends Object = {}>(
      id: keyof T,
      options?: GetFieldDecoratorOptions
    ) => (node: React.ReactNode) => React.ReactNode
  ) => (
    <>
      <Button
        type={"primary"}
        style={{ float: "right" }}
        onClick={() =>
          this.setState({ modalVisible: !this.state.modalVisible })
        }
      >
        CSV Importieren
      </Button>
      <Modal
        title={"CSV Importieren"}
        visible={this.state.modalVisible}
        onCancel={this.onCancel}
        footer={[
          <Button key={"discard"} icon={"delete"} onClick={this.onCancel}>
            Discard
          </Button>,
          <Button
            key={"submit"}
            icon={"cloud-upload-o"}
            type={"primary"}
            loading={this.state.uploadLoading}
            onClick={this.handleSubmit}
          >
            Upload
          </Button>
        ]}
      >
        {this.renderUploadForm(getFieldDecorator)}
      </Modal>
    </>
  );

  render() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    return (
      <Card
        title={"WahlleiterIn Funktionen"}
        style={{ minHeight: "100%" }}
        hoverable={true}
      >
        <Row
          type={"flex"}
          gutter={16}
          justify={"center"}
          style={{ marginTop: "15px" }}
        >
          <Col>{this.renderUploadModal(getFieldDecorator)}</Col>
          <Col>
            <Button
              type={"primary"}
              style={{ float: "right" }}
              onClick={() => {
                message.error("Unimplemented");
              }}
            >
              Stimmen korrigieren
            </Button>
          </Col>
        </Row>
      </Card>
    );
  }
}

const WahlleiterPageComponentWithGraphQL = compose(
  withImportCSVDataMutation<IWahlleiterPageProps>()
)(WahlleiterPageComponent);

export const WahlleiterPage = (Form.create()(
  WahlleiterPageComponentWithGraphQL
) as unknown) as React.ComponentType<IWahlleiterPageProps>;