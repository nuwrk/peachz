const Arweave = require('arweave');
const SmartWeave = require('smartweave').default;
const { Connection, PublicKey, Keypair, Transaction, SystemProgram } = require('@solana/web3.js');
const fs = require('fs');

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 20000,
  logging: false,
});

const smartweave = SmartWeave.default(arweave);

// Load Arweave wallet
const arweaveWallet = JSON.parse(fs.readFileSync('path/to/arweave_wallet.json'));
const contractId = 'your-arweave-contract-id';

// Solana setup
const connection = new Connection('https://api.mainnet-beta.solana.com');
const solanaWallet = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync('path/to/solana_wallet.json'))));

async function uploadMetadataToArweave(metadata) {
  const input = {
    function: 'uploadMetadata',
    metadata: metadata
  };

  try {
    const interactionTx = await smartweave.contracts.writeInteraction(
      contractId,
      input,
      { wallet: arweaveWallet }
    );
    console.log('Metadata uploaded to Arweave with transaction ID:', interactionTx);
    return interactionTx;
  } catch (error) {
    console.error('Error uploading metadata to Arweave:', error);
    throw error;
  }
}

async function recordTransactionOnSolana(metadata, arweaveTxId) {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: solanaWallet.publicKey,
      toPubkey: new PublicKey('recipient-public-key'), // Replace with the recipient's public key
      lamports: 1 * LAMPORTS_PER_SOL, // Replace with the desired amount
    })
  );

  try {
    const signature = await connection.sendTransaction(transaction, [solanaWallet]);
    console.log('Transaction recorded on Solana with signature:', signature);
    return signature;
  } catch (error) {
    console.error('Error recording transaction on Solana:', error);
    throw error;
  }
}

async function handleMetadataUpload(metadata) {
  try {
    // Upload metadata to Arweave
    const arweaveTxId = await uploadMetadataToArweave(metadata);

    // Record transaction on Solana
    const solanaTxSignature = await recordTransactionOnSolana(metadata, arweaveTxId);

    console.log('Successfully handled metadata upload.');
    return { arweaveTxId, solanaTxSignature };
  } catch (error) {
    console.error('Failed to handle metadata upload:', error);
    throw error;
  }
}

// Usage example:
const metadata = {
  songId: 'song-unique-id',
  artist: 'Artist Name',
  title: 'Track Title',
  description: 'Track Description',
  composers: ['Composer One', 'Composer Two'],
  contributors: ['Contributor One', 'Contributor Two'],
  uploadDate: new Date().toISOString()
};

handleMetadataUpload(metadata)
  .then(result => {
    console.log('Result:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  });
