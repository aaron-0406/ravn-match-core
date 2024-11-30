import boom from "boom";
import prisma from "../../client";

export const listTechStack = async () => {
  try {
    const tags = await prisma.tags.findMany();

    return tags;
  } catch (error) {
    throw boom.notFound("Error to list the tags");
  }
};
