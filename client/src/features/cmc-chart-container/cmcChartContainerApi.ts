export interface CmcData {
  year: number;
  month: number;
  day: number;
  name: string;
  rank: number;
  symbol: string;
  marketCap: number;
  imgSrc: string;
}

export const getCmcData = async () => {
  const res = await fetch("/cmc-data");
  return await res.json() as CmcData[];
};
