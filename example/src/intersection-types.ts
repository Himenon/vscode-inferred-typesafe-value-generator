interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtworksData {
  artworks: { title: string }[];
}

interface ArtistsData {
  artists: { name: string }[];
}

export type ArtworksResponse = ArtworksData & ErrorHandling;
export type ArtistsResponse = ArtistsData & ErrorHandling;

const artworksResponse: ArtworksResponse = {
  success: false,
  error: {
    message: "",
  },
  artworks: [],
};

const artistsResponse: ArtistsResponse = {
  success: false,
  error: {
    message: "",
  },
  artists: [],
};
