import path from "path";
import { unlink, writeFile } from "fs/promises";
import { NextResponse } from "next/server";


export async function POST(req: any) {
    const formData = await req.formData();

    const file = formData.get("file");
    if (!file) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename =  file.name.replaceAll(" ", "_");
    try {
        await writeFile(
            path.join(process.cwd(), "/public/logo/" + filename),
            buffer
        );
        return NextResponse.json({ Message: "Success", status: 201 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
}


export async function DELETE(req: any) {
    const formData = await req.formData();

    const file = formData.get("file");
    if (!file) {
        return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const filename =  file.name.replaceAll(" ", "_");
    try {
      const imagePath = path.join(process.cwd(), "/public/logo/", filename);
      await unlink(imagePath);
      console.log("Image deleted successfully.");
      return { message: "Image deleted successfully.", status: 200 };
    } catch (error) {
      console.error("Error occurred while deleting image:", error);
      return { error: "Failed to delete image.", status: 500 };
    }
}
