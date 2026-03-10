export interface ChallengeTemplate {
  key: string;
  title: string;
  description: string;
}

export const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  {
    key: "streak_warrior",
    title: "🏃 Streak Warrior",
    description: "Maintain a 5+ day streak this week",
  },
  {
    key: "explorer",
    title: "📍 Explorer",
    description: "Log from 3 different locations",
  },
  {
    key: "early_bird",
    title: "🌅 Early Bird",
    description: "Log before 8 AM at least 3 times",
  },
  {
    key: "night_owl",
    title: "🌙 Night Owl",
    description: "Log after 10 PM at least 3 times",
  },
  {
    key: "consistency_king",
    title: "📊 Consistency King",
    description: "Log every single day this week",
  },
  {
    key: "social_butterfly",
    title: "💬 Social Butterfly",
    description: "React to 5 different group members' logs",
  },
  {
    key: "double_down",
    title: "🔥 Double Down",
    description: "Log 2+ times in a single day, 3 different days",
  },
];

export const TEMPLATE_KEYS = CHALLENGE_TEMPLATES.map((t) => t.key);

export function getRandomTemplate(): ChallengeTemplate {
  return CHALLENGE_TEMPLATES[Math.floor(Math.random() * CHALLENGE_TEMPLATES.length)];
}

export function getTemplateByKey(key: string): ChallengeTemplate | undefined {
  return CHALLENGE_TEMPLATES.find((t) => t.key === key);
}
