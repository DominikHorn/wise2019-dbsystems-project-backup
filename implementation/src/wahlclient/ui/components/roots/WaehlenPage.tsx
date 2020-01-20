import { Button, Col, Divider, Icon, message, Row, Tabs, Card } from "antd";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Kandidat, Partei } from "../../../../shared/graphql.types";
import { ErststimmePage } from "../waehlen/ErststimmePage";
import { ZweitstimmePage } from "../waehlen/ZweitstimmePage";
import "./WaehlenPage.css";
import { Rechtsbehelfsbelehrung } from "../waehlen/Rechtsbehelfsbelehrung";

export interface IWaehlenPageProps {
  routeProps: RouteComponentProps<any>;
}

interface IProps extends IWaehlenPageProps {}

interface IState {
  /** Value meanings as follows:
   *
   * undefined: no selection made
   * null: deliberately set stimme to ungueltig
   * any value: this is the deliberately selected value
   */
  readonly selectedErstkandidat?: Kandidat | null;
  readonly selectedZweitkandidat?: Kandidat | null;
  readonly selectedZweitpartei?: Partei | null;
  readonly acceptedRechtsbehelfsbelehrung: boolean;

  readonly activeTab: WahlTab;
}

enum WahlTab {
  RECHTSBEHELFSBELEHRUNG = 0,
  ERSTSTIMME = 1,
  ZWEITSTIMME = 2,
  CHECKVOTE = 3,
  VOTECOMMITED = 4
}

function getWahlTabTitle(wahlTab: WahlTab) {
  switch (wahlTab) {
    case WahlTab.RECHTSBEHELFSBELEHRUNG:
      return "Rechtsbehelfsbelehrung";
    case WahlTab.ERSTSTIMME:
      return "Erststimmabgabe";
    case WahlTab.ZWEITSTIMME:
      return "Zweitstimmabgabe";
    case WahlTab.CHECKVOTE:
      return "Bestätigung";
    case WahlTab.VOTECOMMITED:
      return "Stimmabgabe Beendet";
    default:
      return "Error - Unknown Tab";
  }
}

const LOREM_IPSUM = `
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   
Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.   
Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.   
Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.   
Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis.   
At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, At accusam aliquyam diam diam dolore dolores duo eirmod eos erat, et nonumy sed tempor et et invidunt justo labore Stet clita ea et gubergren, kasd magna no rebum. sanctus sea sed takimata ut vero voluptua. est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.   
Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus.   
Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   
Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.   
Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit.   
`;

export class WaehlenPage extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      activeTab: WahlTab.RECHTSBEHELFSBELEHRUNG,
      acceptedRechtsbehelfsbelehrung: false
    };
  }

  private nextTab = () => {
    if (!this.state.acceptedRechtsbehelfsbelehrung) {
      message.error(
        "Zunächst müssen Sie die Rechtsbehelfsbelehrung lesen und akzeptieren"
      );
      return;
    }
    const nextTab = this.state.activeTab + 1;
    if (nextTab > WahlTab.VOTECOMMITED) {
      return;
    }
    this.setState({
      activeTab: nextTab
    });
  };

  private previousTab = () => {
    this.setState({
      activeTab: Math.max(
        this.state.activeTab - 1,
        WahlTab.RECHTSBEHELFSBELEHRUNG
      )
    });
  };

  private getFurhtestReachableTab = () => {
    const {
      acceptedRechtsbehelfsbelehrung,
      selectedErstkandidat,
      selectedZweitkandidat
    } = this.state;
    if (this.state.activeTab === WahlTab.VOTECOMMITED) return -1;
    if (!acceptedRechtsbehelfsbelehrung) return WahlTab.RECHTSBEHELFSBELEHRUNG;
    if (selectedErstkandidat === undefined) return WahlTab.ERSTSTIMME;
    if (selectedZweitkandidat === undefined) return WahlTab.ZWEITSTIMME;
    return WahlTab.CHECKVOTE;
  };

  private renderInTabContainer = (component: React.ReactElement) => (
    <div
      style={{
        height: `calc(100vh - 109px)`,
        overflowY: "scroll"
      }}
    >
      <div style={{ margin: "20px" }}>{component}</div>
    </div>
  );

  private renderRechtsbelehrung = () =>
    this.renderInTabContainer(
      <>
        <Row type={"flex"} justify={"center"} style={{ marginBottom: "8px" }}>
          <Col style={{ width: "100%" }}>
            <Rechtsbehelfsbelehrung />
          </Col>
        </Row>
        <Row type={"flex"} gutter={16} justify={"end"}>
          <Col>
            <Button
              type={"primary"}
              style={{ float: "right" }}
              onClick={() =>
                this.setState(
                  { acceptedRechtsbehelfsbelehrung: true },
                  this.nextTab
                )
              }
            >
              Zur Kenntnis genommen
              <Icon type={"right"} />
            </Button>
          </Col>
        </Row>
      </>
    );

  private renderErststimme = () =>
    this.renderInTabContainer(
      <ErststimmePage
        wahl={{ id: 2, wahldatum: new Date() }}
        stimmkreis={{ id: 101, name: "München-Mitte" }}
        selectedKandidat={this.state.selectedErstkandidat}
        onSelectKandidat={selectedErstkandidat =>
          this.setState({ selectedErstkandidat })
        }
        goToNextTab={this.nextTab}
        goToPreviousTab={this.previousTab}
      />
    );

  private renderZweitstimme = () =>
    this.renderInTabContainer(
      <ZweitstimmePage
        wahl={{ id: 2, wahldatum: new Date() }}
        regierungsbezirk={{ id: 901, name: "Oberbayern" }}
        selectedKandidat={this.state.selectedZweitkandidat}
        selectedParty={this.state.selectedZweitpartei}
        onSelectKandidat={selectedZweitkandidat =>
          this.setState({ selectedZweitkandidat, selectedZweitpartei: null })
        }
        onSelectParty={selectedZweitpartei =>
          this.setState({ selectedZweitpartei, selectedZweitkandidat: null })
        }
        goToNextTab={this.nextTab}
        goToPreviousTab={this.previousTab}
      />
    );

  private renderCheckVote = () =>
    this.renderInTabContainer(
      <>
        <h1>{"Bitte bestätigen Sie die Korrektheit Ihrer Stimmabgabe:"}</h1>
        <Divider />
        <Row type={"flex"} justify={"center"}>
          <Col>
            <h2>
              {`Ihre Erststimme: ${
                this.state.selectedErstkandidat
                  ? `${this.state.selectedErstkandidat.name} (${this.state.selectedErstkandidat.partei.name})`
                  : "ungültig gemacht"
              }`}
            </h2>
          </Col>
        </Row>
        <Row style={{ marginBottom: "20px" }} type={"flex"} justify={"center"}>
          <Col>
            <h2>
              {`Ihre Zweitstimme: ${
                this.state.selectedZweitkandidat
                  ? `${this.state.selectedZweitkandidat.name} (${this.state.selectedZweitkandidat.partei.name})`
                  : this.state.selectedZweitpartei
                  ? `${this.state.selectedZweitpartei.name} Liste`
                  : "ungültig gemacht"
              }`}
            </h2>
          </Col>
        </Row>
        <Row type={"flex"} justify={"center"} gutter={16}>
          <Col>
            <Button onClick={this.previousTab} icon={"left"}>
              Zurück
            </Button>
          </Col>
          <Col>
            <Button type={"primary"} icon={"check"} onClick={this.nextTab}>
              Stimmen Abgeben
            </Button>
          </Col>
        </Row>
      </>
    );

  private renderVoteCommited = () =>
    this.renderInTabContainer(
      <Row
        type={"flex"}
        justify={"center"}
        align={"middle"}
        style={{ width: "100%", height: `calc(100vh - 149px)`, color: "green" }}
      >
        <Col span={16}>
          <Row type={"flex"} justify={"center"}>
            <Col>
              <Icon type={"check"} style={{ fontSize: "100pt" }} />
            </Col>
          </Row>
          <Row>
            <Col style={{ textAlign: "center", fontSize: "30pt" }}>
              Ihre Stimme wurde erfolgreich abgegeben. Sie können die Wahlkabine
              nun verlassen
            </Col>
          </Row>
        </Col>
      </Row>
    );

  render() {
    const { activeTab } = this.state;
    const tabPaneStyle: React.CSSProperties = {
      margin: "0px"
    };

    const furthestReachableTab = this.getFurhtestReachableTab();

    return (
      <div className={"waehlen-page-container"}>
        <Tabs
          activeKey={`${activeTab}`}
          onChange={activeTabKey =>
            this.setState({
              activeTab: Number(activeTabKey) as WahlTab
            })
          }
          style={{ backgroundColor: "white" }}
        >
          <Tabs.TabPane
            tab={getWahlTabTitle(WahlTab.RECHTSBEHELFSBELEHRUNG)}
            key={`${WahlTab.RECHTSBEHELFSBELEHRUNG}`}
            style={tabPaneStyle}
            disabled={furthestReachableTab < WahlTab.RECHTSBEHELFSBELEHRUNG}
          >
            {this.renderRechtsbelehrung()}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={getWahlTabTitle(WahlTab.ERSTSTIMME)}
            key={`${WahlTab.ERSTSTIMME}`}
            style={tabPaneStyle}
            disabled={furthestReachableTab < WahlTab.ERSTSTIMME}
          >
            {this.renderErststimme()}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={getWahlTabTitle(WahlTab.ZWEITSTIMME)}
            key={`${WahlTab.ZWEITSTIMME}`}
            style={tabPaneStyle}
            disabled={furthestReachableTab < WahlTab.ZWEITSTIMME}
          >
            {this.renderZweitstimme()}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={getWahlTabTitle(WahlTab.CHECKVOTE)}
            key={`${WahlTab.CHECKVOTE}`}
            style={tabPaneStyle}
            disabled={furthestReachableTab < WahlTab.CHECKVOTE}
          >
            {this.renderCheckVote()}
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={getWahlTabTitle(WahlTab.VOTECOMMITED)}
            key={`${WahlTab.VOTECOMMITED}`}
            style={tabPaneStyle}
            disabled={true}
          >
            {this.renderVoteCommited()}
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
