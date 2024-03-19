import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import { unlink, writeFile } from "fs/promises";

export async function POST(req: any) {
    const formData = await req.formData();
    const message: string = formData.get("message");
    const email: string = formData.get("email");
    const fileNames: File[] | [] = formData.getAll("fileName");
    if(fileNames.length > 0) {
        fileNames.forEach(async (file) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename =  file.name.replaceAll(" ", "_");
                await writeFile(
                    path.join(process.cwd(), "/public/file/" + filename),
                    buffer
                );
        });
    }
    const attachments = fileNames.map((file: File) => ({
        filename: file.name.replaceAll(" ", "_"), 
        path: "/Users/yuudaikobayashi/Developer/PHP/medical_check/client/public/file/" + file.name.replaceAll(" ", "_")
    }));
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        requireTLS: true,
        auth: {
            user: "newon0325@gmail.com",
            pass: "vftcnptnztrzqmwn"
        }
    });
    const toHostMailData = {
        from: "kobayashi.empowertec@gmail.com",
        to: email,
        subject: "Web問診より",
        html: `${message}\n`,
        attachments: attachments
    };
    try {
        transporter.sendMail(toHostMailData, function(err, info) {
            if (err) {
                console.log(err, "ERROR")
            } else {
                fileNames.forEach(async (file) => {
                    const filename =  file.name.replaceAll(" ", "_");
                    const imagePath = path.join(process.cwd(), "/public/file/", filename);
                    await unlink(imagePath);
                });
            }
        })
        return NextResponse.json({ Message: "Success", status: 201 });
    } catch {
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
}

