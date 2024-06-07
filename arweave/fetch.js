const express = require('express');
const Arweave = require('arweave');
const SmartWeave = require('smartweave').default;

const app = express();
const port = 3000;

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
  timeout: 20000,
  logging: false,
});

const smartweave = SmartWeave.default(arweave);

// Load the contract ID
const contractId = 'your-arweave-contract-id';

async function getMetadataFromArweave(songId) {
  const contract = smartweave.contract(contractId);
  const state = await contract.readState();
  const metadata = state.state.metadata.find((m) => m.songId === songId);
  return metadata;
}

app.get('/api/getMetadata', async (req, res) => {
  const { songId } = req.query;
  try {
    const metadata = await getMetadataFromArweave(songId);
    if (!metadata) {
      return res.status(404).json({ error: 'Metadata not found' });
    }
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching metadata' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
