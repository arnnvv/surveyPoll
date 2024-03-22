import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export interface Option {
  text: string;
  votes?: number;
  id?: string;
}
export interface Question {
  text: string;
  options: Option[];
  id?: string;
}

export interface Survey {
  title: string;
  questions: Question[];
}

const getAll = async (): Promise<Survey[]> => {
  try {
    console.log("Surveys fetched successfully");
    const surveys = await prisma.survey.findMany({
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
    return surveys.map((survey) => ({
      id: survey.id,
      title: survey.title,
      questions: survey.questions.map((question) => ({
        id: question.id,
        text: question.text,
        options: question.options.map((option) => ({
          id: option.id,
          text: option.text,
          votes: option.votes,
        })),
      })),
    }));
  } catch (error) {
    console.error(`Error in Getting Surveys: ${error}`);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

const get = async (id: string): Promise<Survey | null> => {
  try {
    return await prisma.survey.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(`Error in Getting Survey: ${error}`);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

const post = async (data: Survey): Promise<void> => {
  try {
    await prisma.survey.create({
      data: {
        title: data.title,
        questions: {
          create: data.questions.map((question) => ({
            text: question.text,
            options: {
              create: question.options.map((option) => ({
                text: option.text,
              })),
            },
          })),
        },
      },
    });
    console.log("Survey created successfully");
  } catch (error) {
    console.error(`Error in Creating Survey: ${error}`);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

const put = async (id: string, data: Partial<Survey>): Promise<void> => {
  try {
    await prisma.survey.update({
      where: { id },
      data: {
        title: data.title,
        questions: {
          updateMany: data.questions?.map((question) => ({
            where: { id: question.id },
            data: {
              text: question.text,
              options: {
                updateMany: question.options?.map((option) => ({
                  where: { id: option.id },
                  data: {
                    text: option.text,
                  },
                })),
              },
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
    console.log("Survey updated successfully");
  } catch (error) {
    console.error(`Error in Updating Survey: ${error}`);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

const deleteById = async (id: string): Promise<void> => {
  try {
    await prisma.survey.delete({
      where: {
        id,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
    console.log("Survey deleted successfully");
  } catch (error) {
    console.error(`Error in Deleting Survey: ${error}`);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = {
  getAll,
  get,
  post,
  put,
  deleteById,
};
