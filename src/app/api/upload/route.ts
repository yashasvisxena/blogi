import { NextRequest, NextResponse } from "next/server";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const result = await uploadBufferToCloudinary(buffer, "blog-uploads");
    return NextResponse.json({ success: true, data: result });
  } catch (err: unknown) {
    return NextResponse.json({ error: "Cloud upload failed" }, { status: 500 });
  }
}
