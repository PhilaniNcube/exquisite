import type { CollectionBeforeChangeHook } from "payload";
import type { School } from "@/payload-types";
import type { PayloadRequest } from "payload";

// Function to generate a random pass code
const generateRandomPassCode = (): string => {
  // Generate a 6-character alphanumeric pass code
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Function to check if pass code is unique
const isPassCodeUnique = async (passCode: string, req: PayloadRequest, excludeId?: string | number): Promise<boolean> => {
  try {
    const existingSchool = await req.payload.find({
      collection: 'schools',
        where: {
        and: [
          { pass_code: { equals: passCode } },
          ...(excludeId ? [{ id: { not_equals: excludeId.toString() } }] : [])
        ]
      },
      limit: 1,
    });
    
    return existingSchool.docs.length === 0;
  } catch (error) {
    console.error('Error checking pass code uniqueness:', error);
    return false;
  }
};

export const generatePassCode: CollectionBeforeChangeHook<School> = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  // Only generate pass code if it's not already provided
  if (!data.pass_code) {
    let passCode: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    // Keep generating until we find a unique pass code or reach max attempts
    while (!isUnique && attempts < maxAttempts) {
      passCode = generateRandomPassCode();
      isUnique = await isPassCodeUnique(passCode!, req, originalDoc?.id);
      attempts++;
      
      if (isUnique) {
        data.pass_code = passCode!;
        break;
      }
    }

    if (!isUnique) {
      throw new Error('Unable to generate unique pass code after multiple attempts');
    }
  } else {
    // If pass_code is provided, check if it's unique (for updates)
    if (operation === 'update') {
      const isUnique = await isPassCodeUnique(data.pass_code, req, originalDoc?.id);
      if (!isUnique) {
        throw new Error('Pass code already exists. Please choose a different one.');
      }
    } else if (operation === 'create') {
      const isUnique = await isPassCodeUnique(data.pass_code, req);
      if (!isUnique) {
        throw new Error('Pass code already exists. Please choose a different one.');
      }
    }
  }

  return data;
};