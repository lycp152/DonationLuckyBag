import type { NextPage } from "next";
import Link from "next/link";
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

const Project: NextPage = () => {
  const address = useAddress();
  const { contract: nftDropContract } = useContract(nftDropAddress, "nft-drop");
  const { data: nfts, isLoading } = useOwnedNFTs(nftDropContract, address);

  return (
    <div className={styles.container}>
      {address ? (
        <div>
          <div className={styles.container}>
            <h2>NFTの発行</h2>
            <p>寄付記念NFTを発行します。紐付けを行う場合は元となるNFTです。</p>
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
                NFTを発行する
              </Web3Button>
            </div>
          </div>
          <div className={styles.container}>
            <h2>発行したNFT</h2>
            <p>
              NFTを選択すると、その特典内容を表示します。NFTやトークンを紐付けることもできます。
            </p>
            <NFTGrid
              nfts={nfts}
              isLoading={isLoading}
              emptyText={"まだ寄付先NFTを所持していません！"}
            />
          </div>
          {/* ナビゲーションリンクの追加 */}
          <div className={styles.container}>
            <Link href="/project" />
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

export default Project;
