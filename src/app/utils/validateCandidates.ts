import { assignments, team_members, team_status_report_details } from "@prisma/client";
  
  type Project = {
    projectId: number;
    requiredSeniority: string;
    requiredEnglishLevel: string;
    topics: string[];
    techStack: string[];
  };
  
  type LevelMap = {
    [key: string]: number;
  };
  
  type Priorities = {
    seniority: number;
    englishLevel: number;
    weeklyScore: number;
    topicsPriority: number;
    techStack: number;
  };
  
  function calculateProximityScore(
    developerLevel: string,
    requiredLevel: string,
    levelMap: LevelMap
  ): number {
    const devValue = levelMap[developerLevel] || 0;
    const reqValue = levelMap[requiredLevel] || 0;
  
    const distance = Math.abs(reqValue - devValue);
    const maxDistance = Math.max(...Object.values(levelMap)) - Math.min(...Object.values(levelMap));
  
    return maxDistance > 0 ? 1 - distance / maxDistance : 0;
  }

  type TeamMemberWithDetails = team_members & {
    team_status_report_details: (team_status_report_details & {
        normalized_health_score?: number
    })[];
};
function normalizeScores(developers: TeamMemberWithDetails[]): TeamMemberWithDetails[] {
    // Extraer todos los health_scores y filtrar los nulos
    const allScores = developers.flatMap((dev) =>
        dev.team_status_report_details.map((report) => report.health_score)
    ).filter((score): score is number => score !== null); // Filtrar nulos

    console.log("All scores:", allScores);

    // Calcular el mínimo y máximo
    const minScore = Math.min(...allScores);
    const maxScore = Math.max(...allScores);

    console.log("Min score:", minScore);
    console.log("Max score:", maxScore);

    // Si todos los scores son iguales, asignar 1 como valor normalizado
    if (minScore === maxScore) {
        developers.forEach((dev) =>
            dev.team_status_report_details.forEach((report) => {
                if (report.health_score !== null) {
                    report.normalized_health_score = 1; // Asignar valor constante
                }
            })
        );
        return [];
    }

    // Normalizar los scores y asignar el resultado
    developers.forEach((dev) =>
        dev.team_status_report_details.forEach((report) => {
            if (report.health_score !== null) {
                report.normalized_health_score =
                    (report.health_score - minScore) / (maxScore - minScore); // Fórmula de normalización
            }
        })
    );

    return developers
}
  
  function calculateTopicScore(developerTopics: string[], projectTopics: string[]): number {
    if (projectTopics.length === 0) return 1; // Si no hay temas requeridos, puntuación completa
  
    const matches = developerTopics.filter((topic) => projectTopics.includes(topic)).length;
    return matches / projectTopics.length;
  }

  function calculateTechStackScore(developerTechStacks: string[], projectTechStacks: string[]): number {
    if (projectTechStacks.length === 0) return 1; // Si no hay temas requeridos, puntuación completa
  
    const matches = developerTechStacks.filter((topic) => projectTechStacks.includes(topic)).length;
    return matches / projectTechStacks.length;
  }
  
  function calculateMatchScore(
    developer: team_members & {
        normalizedWeeklyScore?: number
        assignments_assignments_team_member_idToteam_members: (assignments & {
            topics: {name: string}
            AssignmentsToTags: any[]
        })[]
    },
    project: Project,
    priorities: Priorities,
    levelMaps: { seniorityMap: LevelMap; englishLevelMap: LevelMap },
  ): number {
    const seniorityScore = calculateProximityScore(
      developer.seniority_level as string,
      project.requiredSeniority,
      levelMaps.seniorityMap
    );
  
    const englishScore = calculateProximityScore(
      developer.english_level as string,
      project.requiredEnglishLevel,
      levelMaps.englishLevelMap
    );
  
    const weeklyScore = developer.normalizedWeeklyScore || 0;
    const developerTopics: string[] = developer.assignments_assignments_team_member_idToteam_members.flatMap(item => item.topics)
    .map(topic => topic.name)
    .filter(name => name);

    const developerTags: string[] = Array.from(
        new Set(developer.assignments_assignments_team_member_idToteam_members.flatMap(item => item.AssignmentsToTags)
    .map(topic => topic.tags)
    .map(topic => topic.name)
    .filter(name => name)
        ))
    console.log(developerTags)

    // const techStack: string[] = developer..flatMap(item => item.topics)
    // .map(topic => topic.name)
    // .filter(name => name);
  
    const topicScore = calculateTopicScore(developerTopics, project.topics);

    const stackScore = calculateTechStackScore(developerTags, project.techStack);
  
    const totalScore =
      priorities.seniority * seniorityScore +
      priorities.englishLevel * englishScore +
      priorities.weeklyScore * weeklyScore +
      priorities.topicsPriority * topicScore +
      priorities.techStack * stackScore;
  
    return parseFloat(totalScore.toFixed(4));
  }
  
  function normalizeWeights(weights: Record<string, number>): Priorities {
    const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    const normalized: Record<string, number> = {};
  
    Object.entries(weights).forEach(([key, value]) => {
      normalized[key] = value / total;
    });
  
    return normalized as Priorities;
  }
  
  function generateScoresForProject(
    project: Project,
    developers: team_members[],
    priorities: Priorities,
    levelMaps: { seniorityMap: LevelMap; englishLevelMap: LevelMap },
  ): { developerId: number; score: number }[] {
    normalizeScores(developers as any);
  
    return developers
      .map((developer) => ({
        developerId: developer.id,
        score: calculateMatchScore(developer as any, project, priorities, levelMaps),
      }))
      .sort((a, b) => b.score - a.score) as any;
  }
  
  const weights = {
    seniority: 7,
    englishLevel: 7,
    weeklyScore: 2,
    topicsPriority: 3,
    techStack: 4
  };
  
  const priorities = normalizeWeights(weights);
  
  const levelMaps = {
    seniorityMap: { Trainee: 1, Junior: 2, "Junior-mid": 3, Mid: 4, "Mid-senior": 5, Senior: 6},
    englishLevelMap: { Basic: 1, Proficient: 2, Advanced: 3 },
  };
  
  export { generateScoresForProject, normalizeScores, priorities, levelMaps}
  