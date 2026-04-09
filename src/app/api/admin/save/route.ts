import { NextRequest, NextResponse } from "next/server";

interface SaveRequest {
  file: string;
  data: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const { file, data }: SaveRequest = await request.json();

    // Validate inputs
    if (!file || !data) {
      return NextResponse.json(
        { success: false, message: "Missing file or data" },
        { status: 400 }
      );
    }

    // Validate file name (prevent directory traversal)
    const validFiles = [
      "drivers.json",
      "standings.json",
      "races.json",
      "cars.json",
      "tracks.json",
      "league.json",
    ];

    if (!validFiles.includes(file)) {
      return NextResponse.json(
        { success: false, message: "Invalid file" },
        { status: 400 }
      );
    }

    // Get GitHub token and repo info from env
    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO;

    if (!githubToken || !githubRepo) {
      return NextResponse.json(
        { success: false, message: "GitHub credentials not configured" },
        { status: 500 }
      );
    }

    // Parse repo (format: owner/repo)
    const [owner, repo] = githubRepo.split("/");

    // Step 1: Get the current file SHA
    const getFileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/src/data/${file}`;

    const getFileResponse = await fetch(getFileUrl, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!getFileResponse.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch file from GitHub" },
        { status: 500 }
      );
    }

    const fileData = await getFileResponse.json();
    const sha = fileData.sha;

    // Step 2: Update the file
    const updateUrl = `https://api.github.com/repos/${owner}/${repo}/contents/src/data/${file}`;
    const newContent = Buffer.from(JSON.stringify(data, null, 2)).toString(
      "base64"
    );

    const updateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        message: `Update ${file} via admin portal`,
        content: newContent,
        sha,
      }),
    });

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      return NextResponse.json(
        { success: false, message: "Failed to update file on GitHub", error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${file} updated successfully. Changes will be deployed on next build.`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Save failed", error: String(error) },
      { status: 500 }
    );
  }
}
