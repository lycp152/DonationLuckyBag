import type { NextPage } from "next";
import styles from "../styles/Main.module.css";
import NFTGrid from "../components/NFT/NFTGrid";
import {
  ConnectWallet,
  Web3Button,
  useAddress,
  useContract,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import { nftDropAddress } from "../const/constants";
import toast from "react-hot-toast";
import toastStyle from "../util/toastConfig";

/**
 * The home page of the application.
 */
const Home: NextPage = () => {
  const address = useAddress();
  const { contract: nftDropContract } = useContract(nftDropAddress, "nft-drop");
  const { data: nfts, isLoading } = useOwnedNFTs(nftDropContract, address);

  return (
    <div className={styles.container}>
      {address ? (
        <div>
          <div className={styles.container}>
            <h2>募金先を選ぶ</h2>
            <p>募金額を入力すると、ランダムな募金先をいくつか提案します。</p>
            <div className={styles.btnContainer}>
              <Web3Button
                contractAddress={nftDropAddress}
                action={async (contract) => await contract?.erc721.claim(1)}
                onSuccess={() => {
                  toast("NFT Claimed!", {
                    icon: "✅",
                    style: toastStyle,
                    position: "bottom-center",
                  });
                }}
                onError={(e) => {
                  toast(`NFT Claim Failed! Reason: ${e.message}`, {
                    icon: "❌",
                    style: toastStyle,
                    position: "bottom-center",
                  });
                }}
              >
                募金する
              </Web3Button>
            </div>
          </div>
          <div className={styles.container}>
            <h2>所持しているNFT</h2>
            <p>寄付先NFTを選択すると、その特典内容を表示します。</p>

            <NFTGrid
              nfts={nfts}
              isLoading={isLoading}
              emptyText={"まだ寄付先NFTを所持していません！"}
            />
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <h2>パーソナルウォレットに接続し、所有するNFTを確認できます。</h2>
          <ConnectWallet />
        </div>
      )}
    </div>
  );
};

export default Home;
