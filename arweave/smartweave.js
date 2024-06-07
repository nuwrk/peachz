export function handle(state, action) {
    const input = action.input;
    const caller = action.caller;
  
    switch (input.function) {
      case 'uploadMetadata':
        return uploadMetadata(state, input.metadata, caller);
      case 'getMetadata':
        return getMetadata(state, input.songId);
      default:
        throw new ContractError(`No function supplied or function not recognized: "${input.function}"`);
    }
  }
  
  function uploadMetadata(state, metadata, caller) {
    if (!metadata.songId || !metadata.artist || !metadata.title || !metadata.composers || !metadata.uploadDate) {
      throw new ContractError('Invalid metadata format.');
    }
  
    if (!Array.isArray(metadata.composers) || !Array.isArray(metadata.contributors)) {
      throw new ContractError('Composers and contributors should be arrays.');
    }
  
    const existingMetadata = state.metadata.find(m => m.songId === metadata.songId);
    if (existingMetadata) {
      throw new ContractError('Metadata for this song already exists.');
    }
  
    state.metadata.push({
      songId: metadata.songId,
      artist: metadata.artist,
      title: metadata.title,
      description: metadata.description,
      composers: metadata.composers,
      contributors: metadata.contributors,
      uploadDate: metadata.uploadDate,
      uploader: caller
    });
  
    return { state };
  }
  
  function getMetadata(state, songId) {
    const metadata = state.metadata.find(m => m.songId === songId);
    if (!metadata) {
      throw new ContractError('Metadata not found.');
    }
  
    return { result: metadata };
  }
  