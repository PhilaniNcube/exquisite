import { getPayload } from "payload";
import config from "@payload-config";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return Response.json({ success: false, message: "Missing ids parameter" }, { status: 400 });
    }

    const ids = idsParam
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    if (ids.length === 0) {
      return Response.json({ success: false, message: "No valid ids provided" }, { status: 400 });
    }

    const payload = await getPayload({ config });
    const schools = await payload.find({
      collection: "schools",
      where: {
        id: {
          in: ids,
        },
      },
      limit: ids.length,
    });

    const deadlines = schools.docs.map((school) => ({
      id: school.id,
      name: school.name,
      orderDeadline: school.order_deadline ?? null,
    }));

    return Response.json({ success: true, deadlines });
  } catch (error) {
    console.error("Error fetching school deadlines:", error);
    return Response.json(
      { success: false, message: "Failed to fetch school deadlines" },
      { status: 500 }
    );
  }
}
