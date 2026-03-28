import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("photo") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Convert file to base64 or upload to external storage
    // For now, we'll store as data URL (in production, use Cloudinary, S3, etc.)
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const photoUrl = `data:${file.type};base64,${base64}`;

    // Save to Convex database
    await client.mutation(api.functions.upsertProfilePhoto, {
      userEmail: session.user.email,
      photoUrl,
    });

    return NextResponse.json({
      success: true,
      message: "Profile photo uploaded successfully",
    });
  } catch (error) {
    console.error("Profile photo upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload profile photo" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await client.mutation(api.functions.deleteProfilePhoto, {
      userEmail: session.user.email,
    });

    return NextResponse.json({
      success: true,
      message: "Profile photo deleted successfully",
    });
  } catch (error) {
    console.error("Profile photo delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete profile photo" },
      { status: 500 }
    );
  }
}
