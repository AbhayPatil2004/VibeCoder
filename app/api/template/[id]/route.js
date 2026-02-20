// import {
//   readTemplateStructureFromJson,
//   saveTemplateStructureToJson,
// } from "@/modules/playground/lib/path-to-json";

// import connectToDatabase from "@/lib/db";
// import { templatePaths } from "@/lib/template";
// import path from "path";
// import fs from "fs/promises";
// import Playground from "@/models/Playground";

// function validateJsonStructure(data) {
//   try {
//     JSON.parse(JSON.stringify(data));
//     return true;
//   } catch (error) {
//     console.error("Invalid JSON structure:", error);
//     return false;
//   }
// }

// export async function GET(request, context) {
//   try {
//     const { params } = context;
//     const { id } = await params; // 🔥 THIS IS THE FIX

//     if (!id) {
//       return Response.json(
//         { error: "Missing playground ID" },
//         { status: 400 }
//       );
//     }

//     await connectToDatabase();

//     const playground = await Playground.findById(id).lean();

//     if (!playground) {
//       return Response.json(
//         { error: "Playground not found" },
//         { status: 404 }
//       );
//     }

//     const templateKey = playground.template;
//     const templatePath = templatePaths[templateKey];

//     if (!templatePath) {
//       return Response.json(
//         { error: "Invalid template" },
//         { status: 404 }
//       );
//     }

//     const inputPath = path.join(process.cwd(), templatePath);
//     const outputFile = path.join(
//       process.cwd(),
//       `output/${templateKey}.json`
//     );

//     await saveTemplateStructureToJson(inputPath, outputFile);
//     const result = await readTemplateStructureFromJson(outputFile);

//     await fs.unlink(outputFile);

//     return Response.json(
//       { success: true, templateJson: result },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error generating template JSON:", error);
//     return Response.json(
//       { error: "Failed to generate template" },
//       { status: 500 }
//     );
//   }
// }


import {
  readTemplateStructureFromJson,
} from "@/modules/playground/lib/path-to-json";

import connectToDatabase from "@/lib/db";
import { templatePaths } from "@/lib/template";
import path from "path";
import Playground from "@/models/Playground";

export async function GET(request, context) {
  try {
    const { id } = await context.params;

    if (!id) {
      return Response.json(
        { error: "Missing playground ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const playground = await Playground.findById(id).lean();

    if (!playground) {
      return Response.json(
        { error: "Playground not found" },
        { status: 404 }
      );
    }

    const templateKey = playground.template;
    const templatePath = templatePaths[templateKey];

    if (!templatePath) {
      return Response.json(
        { error: "Invalid template" },
        { status: 404 }
      );
    }

    const inputPath = path.join(process.cwd(), templatePath);

    // 🔥 Directly read template (NO file writing)
    const result = await readTemplateStructureFromJson(inputPath);

    return Response.json(
      { success: true, templateJson: result },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error generating template JSON:", error);

    return Response.json(
      { error: "Failed to generate template" },
      { status: 500 }
    );
  }
}