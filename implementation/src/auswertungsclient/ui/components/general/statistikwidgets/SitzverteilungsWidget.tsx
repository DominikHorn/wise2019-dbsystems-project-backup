import * as React from "react";
import { compose } from "react-apollo";
import {
  IGetAllWahlenQueryHocProps,
  withAllWahlenQuery
} from "../../../../../client-graphql/public/getAllWahlenQuery";
import { IGetMandateQueryHocProps } from "../../../../../client-graphql/public/getMandateQuery";
import { Wahl } from "../../../../../shared/graphql.types";
import { renderInfo } from "../../../../../wahlclient/ui/guiUtil";
import { IStatistikWidgetProps, StatistikWidget } from "../StatistikWidget";
import { WahlSelector } from "../dataselectors/WahlSelector";
import { SitzverteilungsChart } from "./SitzverteilungsChart";
import { SitzverteilungsTable } from "./SitzverteilungsTable";

interface IState {
  selectedWahl?: Wahl;
}
export interface ISitzverteilungsWidgetProps
  extends IStatistikWidgetProps<IState> {
  readonly renderAsTable?: boolean;
}

interface IProps
  extends ISitzverteilungsWidgetProps,
    IGetAllWahlenQueryHocProps,
    IGetMandateQueryHocProps {}

class SitzverteilungsWidgetComponent extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  private onSelectWahl = (selectedWahl: Wahl) =>
    this.props.setRoutableState
      ? this.props.setRoutableState({ selectedWahl })
      : this.setState({ selectedWahl });

  render() {
    const { allWahlenData, renderAsTable, routableState } = this.props;
    let selectedWahl = null;
    if (routableState) {
      selectedWahl = routableState.selectedWahl;
    } else {
      selectedWahl = this.state.selectedWahl;
    }

    return (
      <StatistikWidget
        {...this.props}
        title={
          <>
            <span style={{ float: "left" }}>{"Landtagswahl:"}</span>
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
          renderAsTable ? (
            <SitzverteilungsTable wahl={selectedWahl} />
          ) : (
            <SitzverteilungsChart wahl={selectedWahl} />
          )
        ) : (
          renderInfo("Bitte eine Wahl auswählen")
        )}
      </StatistikWidget>
    );
  }
}

const SitzverteilungsWidgetWithQueries = compose(
  withAllWahlenQuery<ISitzverteilungsWidgetProps>()
)(SitzverteilungsWidgetComponent);

export const SitzverteilungsWidget = SitzverteilungsWidgetWithQueries as React.ComponentType<
  ISitzverteilungsWidgetProps
>;
