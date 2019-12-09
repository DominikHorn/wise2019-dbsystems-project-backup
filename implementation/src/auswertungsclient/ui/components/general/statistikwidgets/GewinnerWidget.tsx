import * as React from "react";
import { compose } from "react-apollo";
import {
  withAllWahlenQuery,
  IGetAllWahlenQueryHocProps
} from "../../../../../client-graphql/public/getAllWahlenQuery";
import { IStatistikWidgetProps, StatistikWidget } from "../StatistikWidget";
import { WahlSelector } from "../dataselectors/WahlSelector";
import { IWahl } from "../../../../../shared/sharedTypes";
import { GewinnerGeoChart } from "./GewinnerGeoChart";
import { renderInfo } from "../../../../../wahlclient/ui/guiUtil";

export interface IGewinnerWidgetProps extends IStatistikWidgetProps {}

interface IProps extends IGewinnerWidgetProps, IGetAllWahlenQueryHocProps {}

interface IState {
  readonly selectedWahl?: IWahl;
  readonly erststimmen: boolean;
}

class GewinnerWidgetComponent extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      erststimmen: true
    };
  }

  private onSelectWahl = (selectedWahl: IWahl) =>
    this.setState({ selectedWahl });

  private onSelectErststimmen = (erststimmen: boolean) =>
    this.setState({ erststimmen });

  render() {
    const { allWahlenData } = this.props;
    const { selectedWahl, erststimmen } = this.state;
    return (
      <StatistikWidget
        {...this.props}
        title={
          <>
            <span style={{ float: "left" }}>{"Stimmkreisgewinner:"}</span>
            <span
              style={{
                display: "block",
                overflow: "hidden",
                paddingRight: "10px",
                paddingLeft: "10px"
              }}
            >
              <WahlSelector
                displayLoading={allWahlenData.loading}
                selectedWahl={selectedWahl}
                selectableWahlen={allWahlenData.allWahlen}
                onSelectWahl={this.onSelectWahl}
                selectDefaultWahl={true}
                style={{ width: "100%" }}
                size={"small"}
              />
            </span>
          </>
        }
      >
        {selectedWahl ? (
          <GewinnerGeoChart
            erststimmen={erststimmen}
            onErststimmenChanged={this.onSelectErststimmen}
            wahl={selectedWahl}
          />
        ) : (
          renderInfo("Bitte eine Wahl auswählen")
        )}
      </StatistikWidget>
    );
  }
}

const GewinnerWidgetWithQueries = compose(
  withAllWahlenQuery<IGewinnerWidgetProps>()
)(GewinnerWidgetComponent);

export const GewinnerWidget = GewinnerWidgetWithQueries as React.ComponentType<
  IGewinnerWidgetProps
>;
