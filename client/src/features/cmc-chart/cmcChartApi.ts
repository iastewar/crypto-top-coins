export interface CmcData {
  year: number;
  month: number;
  name: string;
  rank: number;
  symbol: string;
  marketCap: number;
}

export const getCmcData = async () => {
  const res = await fetch("/cmc-data");
  return await res.json() as CmcData[];
};
