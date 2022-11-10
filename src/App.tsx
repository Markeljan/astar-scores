import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import PublicIcon from "@mui/icons-material/Public";
import { Box } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { formatUnits } from "ethers/lib/utils.js";

export default function App() {
  const client = new ApolloClient({
    uri: "https://squid.subsquid.io/astar-erc-tokens/v/v2/graphql",
    cache: new InMemoryCache(),
  });
  const { address } = useAccount();
  const [erc20Balances, setErc20Balances] = useState<any>(null);

  let account = "0xdfFfe07639E7e669CD34D47Bc7436F378d713360";

  useEffect(() => {
    async function getData() {
      client
        .query({
          query: gql`
          query erc20Balances {
            accountFTokenBalances(where: {account: {id_eq: "${account}"}, amount_gt: "0"}) {
              token {
                name
                id
                decimals
                symbol
              }
              amount
            }
          }
          
          `,
        })
        .then((result) => setErc20Balances(result.data));
    }
    getData();
  }, []);

  useEffect(() => {
    if (erc20Balances) {
      console.log(erc20Balances);
    }
  }, [erc20Balances]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        pr: 2,
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "right",
          width: "100%",
        }}
      >
        <ConnectButton />
      </Box>

      <Box sx={{ justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {erc20Balances?.accountFTokenBalances.map((token: any) => (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <PublicIcon />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box sx={{ fontSize: 14, fontWeight: 500 }}>{token.token.name}</Box>
                  <Box sx={{ fontSize: 12, fontWeight: 300 }}>{token.token.id}</Box>
                </Box>
              </Box>
              <Box sx={{ fontSize: 14, fontWeight: 500 }}>
                {Number(formatUnits(token.amount, token.decimals)).toFixed(2)}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
