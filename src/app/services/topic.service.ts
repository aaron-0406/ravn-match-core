import { PrismaClient } from "@prisma/client";
import boom from "boom";

const prisma = new PrismaClient();

export const listTopics = async () => {
  try {
    const topics = await prisma.topic.findMany();

    return topics;
  } catch (error) {
    throw boom.notFound("Error to create the topic");
  }
};

export const createTopic = async (name: string) => {
  try {
    const topic = await prisma.topic.create({
      data: { name },
    });

    return topic;
  } catch (error) {
    throw boom.notFound("Error to create the topic");
  }
};

export const updateTopic = async (id: number, name: string) => {
  try {
    const topic = await prisma.topic.update({
      where: { id: Number(id) },
      data: { name },
    });

    return topic;
  } catch (error) {
    throw boom.notFound("Error to update the topic");
  }
};

export const deleteTopic = async (id: number) => {
  try {
    const topic = await prisma.topic.delete({
      where: { id: Number(id) },
    });

    return topic.id;
  } catch (error) {
    throw boom.notFound("Error to delete the topic");
  }
};
