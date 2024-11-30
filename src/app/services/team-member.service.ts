import boom from "boom";
import prisma from "../../client";
import {generateScoresForProject, levelMaps, normalizeScores, priorities} from "../utils/validateCandidates";

export const listTeamMember = async (requiredSeniority: string, requiredEnglishLevel: string, topics: string[], techStack: string[]) => {
  try {
    const teamMembers = await prisma.team_members.findMany({
        include: {
            team_status_report_details: true,
            assignments_assignments_team_member_idToteam_members: {
                select: {
                    topics: {
                        select: {
                            name: true
                        }
                    },
                    AssignmentsToTags: {
                        select: {
                            tags: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            },
        }
    });

    const response = generateScoresForProject(
        {
            projectId: 1,
            requiredSeniority,
            requiredEnglishLevel,
            topics,
            techStack
        },
        teamMembers,
        priorities,
        levelMaps          
    )

    return response;
  } catch (error) {
    console.log(error)
    throw boom.notFound("Error to list the team members");
  }
};
