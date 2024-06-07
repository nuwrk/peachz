const Arweave = require('arweave');
const SmartWeave = require('smartweave').default;
const fs = require('fs');

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 20000,
  logging: false,
});

const smartweave = SmartWeave.default(arweave);

async function uploadMetadata(wallet, contractId, metadata) {
  const input = {
    function: 'uploadMetadata',
    metadata: metadata
  };

  try {
    const interactionTx = await smartweave.contracts.writeInteraction(
      contractId,
      input,
      { wallet }
    );

    console.log('Metadata uploaded with transaction ID:', interactionTx);
    return interactionTx;
  } catch (error) {
    console.error('Error uploading metadata:', error);
    throw error;
  }
}

// Load the wallet
const wallet = JSON.parse(fs.readFileSync('path/to/wallet.json'));

// Example metadata
const metadata = {
  songId: 'song-unique-id',
  artist: 'Artist Name',
  title: 'Track Title',
  description: 'Track Description',
  composers: ['Composer One', 'Composer Two'],
  contributors: ['Contributor One', 'Contributor Two'],
  uploadDate: new Date().toISOString()
};

uploadMetadata(wallet, 'your-contract-id', metadata)
  .then(txId => {
    console.log('Transaction ID:', txId);
  })
  .catch(error => {
    console.error('Failed to upload metadata:', error);
  });
