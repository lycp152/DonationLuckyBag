import {
  MediaRenderer,
  ThirdwebNftMedia,
  useAddress,
  useWallet,
} from "@thirdweb-dev/react";
import { NFT, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Signer } from "ethers";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import newSmartWallet from "../../../components/SmartWallet/SmartWallet";
import SmartWalletConnected from "../../../components/SmartWallet/smartConnected";
import { activeChain, nftDropAddress } from "../../../const/constants";
import styles from "../../../styles/Token.module.css";

type Props = {
  nft: NFT;
  contractMetadata: any;
};

export default function TokenPage({ nft, contractMetadata }: Props) {
  const [smartWalletAddress, setSmartWalletAddress] = useState<string | null>(
    null
  );
  const [signer, setSigner] = useState<Signer>();

  // get the currently connected wallet
  const address = useAddress();
  const wallet = useWallet();

  // create a smart wallet for the NFT
  useEffect(() => {
    const createSmartWallet = async (nft: NFT) => {
      if (nft && smartWalletAddress == null && address && wallet) {
        const smartWallet = newSmartWallet(nft);
        await smartWallet.connect({
          personalWallet: wallet,
        });
        setSigner(await smartWallet.getSigner());
        setSmartWalletAddress(await smartWallet.getAddress());
        return smartWallet;
      }
    };
    createSmartWallet(nft);
  }, [nft, smartWalletAddress, address, wallet, signer]);

  return (
    <div className={styles.container}>
      <Toaster position="bottom-center" reverseOrder={false} />

      <div className={styles.metadataContainer}>
        <ThirdwebNftMedia metadata={nft.metadata} className={styles.image} />
      </div>

      <div className={styles.listingContainer}>
        {contractMetadata && (
          <div className={styles.contractMetadataContainer}>
            {contractMetadata.image && (
              <MediaRenderer
                src={contractMetadata.image}
                className={styles.collectionImage}
              />
            )}
            <p className={styles.collectionName}>{contractMetadata.name}</p>
          </div>
        )}
        <h1 className={styles.title}>{nft.metadata.name}</h1>
        <p className={styles.collectionName}>Token ID #{nft.metadata.id}</p>
        <p className={styles.collectionName}>
          Smart wallet address: {smartWalletAddress}
        </p>
        {smartWalletAddress ? (
          <SmartWalletConnected signer={signer} />
        ) : (
          <div className={styles.btnContainer}>
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenId = context.params?.tokenId as string;

  const sdk = new ThirdwebSDK(activeChain, {
    secretKey: process.env.TW_SECRET_KEY,
  });

  const contract = await sdk.getContract(nftDropAddress);

  const nft = await contract.erc721.get(tokenId);

  let contractMetadata;

  try {
    contractMetadata = await contract.metadata.get();
  } catch (e) {}

  return {
    props: {
      nft,
      contractMetadata: contractMetadata || null,
    },
  };
};
