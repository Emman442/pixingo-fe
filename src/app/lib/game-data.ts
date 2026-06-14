
import { PlaceHolderImages } from './placeholder-images';

export type RoundData = {
  id: number;
  images: string[];
  expectedConcept: string;
};

export const MATCH_ROUNDS: RoundData[] = [
  {
    id: 1,
    images: [
      PlaceHolderImages[0].imageUrl,
      PlaceHolderImages[1].imageUrl,
      PlaceHolderImages[2].imageUrl,
      PlaceHolderImages[3].imageUrl,
    ],
    expectedConcept: "Heat",
  },
  {
    id: 2,
    images: [
      PlaceHolderImages[4].imageUrl,
      PlaceHolderImages[5].imageUrl,
      PlaceHolderImages[6].imageUrl,
      PlaceHolderImages[7].imageUrl,
    ],
    expectedConcept: "Time",
  },
  {
    id: 3,
    images: [
      PlaceHolderImages[8].imageUrl,
      PlaceHolderImages[9].imageUrl,
      PlaceHolderImages[10].imageUrl,
      PlaceHolderImages[11].imageUrl,
    ],
    expectedConcept: "Water",
  },
  {
    id: 4,
    images: [
      PlaceHolderImages[12].imageUrl,
      PlaceHolderImages[13].imageUrl,
      PlaceHolderImages[14].imageUrl,
      PlaceHolderImages[15].imageUrl,
    ],
    expectedConcept: "Knowledge",
  },
];
