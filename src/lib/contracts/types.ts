export interface UserProfile {

  username: string
  wallet_address: string
  total_challenges_entered: string
  total_wins: number
  total_earned_gen: number
  reputation_score: number
}




export interface TransactionReceipt {
  status: string;
  hash: string;
  blockNumber?: number;
  [key: string]: any;
}