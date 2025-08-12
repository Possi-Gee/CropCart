'use server';

import { getFarmingTips } from '@/ai/flows/farming-tips';
import { FarmingTipsClient } from '@/components/farmer/FarmingTipsClient';

export default async function AiTipsPage() {
  return <FarmingTipsClient getFarmingTips={getFarmingTips} />;
}
