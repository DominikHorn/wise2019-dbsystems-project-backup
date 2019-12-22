import gql from "graphql-tag";
import {
  WahlhelferToken,
  MutationToGenerateWahlhelferTokensArgs
} from "../../shared/graphql.types";
import { FetchResult } from "apollo-link";
import { createTypedGraphqlHoc } from "../typedGraphql";
import { WahlSelector } from "../../auswertungsclient/ui/components/general/dataselectors/WahlSelector";

const generateWahlhelferTokensGQL = gql`
  mutation generateWahlhelferTokensMutation($wahlleiterAuth: String!) {
    wahlhelferTokens: generateWahlhelferTokens(
      wahlleiterAuth: $wahlleiterAuth
    ) {
      wahl {
        id
        wahldatum
      }
      stimmkreis {
        id
        name
      }
      token
    }
  }
`;

interface MutationToGenerateWahlhelferTokensResponse {
  readonly wahlhelferTokens?: WahlhelferToken[];
}

export interface IGenerateWahlhelferTokensHOCProps {
  readonly generateWahlhelferTokens: (
    variables: MutationToGenerateWahlhelferTokensArgs
  ) => Promise<void | FetchResult<MutationToGenerateWahlhelferTokensResponse>>;
}

const generateWahlhelferTokensTypedHOC = createTypedGraphqlHoc<
  MutationToGenerateWahlhelferTokensResponse,
  MutationToGenerateWahlhelferTokensArgs
>(generateWahlhelferTokensGQL);

export const withGenerateWahlhelferTokensMutation = <TProps = {}>() =>
  generateWahlhelferTokensTypedHOC<TProps, IGenerateWahlhelferTokensHOCProps>({
    props: ({ mutate }) => ({
      generateWahlhelferTokens: (
        variables: MutationToGenerateWahlhelferTokensArgs
      ) =>
        mutate({ variables }).then(
          res =>
            res && {
              ...res,
              data: {
                ...res.data,
                wahlhelferTokens: (res.data.wahlhelferTokens || []).map(
                  token => ({
                    ...token,
                    wahl: {
                      ...token.wahl,
                      wahldatum: new Date(token.wahl.wahldatum)
                    }
                  })
                )
              }
            }
        )
    })
  });
