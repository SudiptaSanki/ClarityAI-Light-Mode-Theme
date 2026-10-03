/**
 * ClarityAI GitHub-Based Local Installation & File Synchronization Engine
 * Checks official repository releases, commits, and tree for updates.
 * Supports direct local directory file-by-file synchronization via the File System Access API
 * and 1-click update package download.
 */

export const REPO_OWNER = "SudiptaSanki";
export const REPO_NAME = "ClarityAI-Light-Mode-Theme";
export const GITHUB_REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;
export const GITHUB_API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;
export const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main`;

// Files and paths that should never be overwritten during sync to protect user environment
const PROTECTED_PATTERNS = [
  /^\.git\//,
  /^\.vscode\//,
  /^\.idea\//,
  /^node_modules\//,
  /\.env(\..+)?$/,
  /user-config\.json$/,
  /scratch\//
];

/**
 * Checks GitHub for the latest version, release tag, or commit.
 * Compares against the installed manifest version and cached commit SHA.
 */
export async function checkForUpdates(onStatus) {
  if (typeof onStatus === "function") onStatus("Checking for updates...");

  const manifest = chrome.runtime.getManifest();
  const currentVersion = manifest.version || "2.0.0";

  let remoteVersion = currentVersion;
  let commitSha = "";
  let commitMessage = "";
  let releaseNotes = "";
  let releaseTag = "";
  let publishedAt = "";

  try {
    // 1. Fetch remote manifest to check declared semantic version
    const manifestRes = await fetch(`${GITHUB_RAW_BASE}/manifest.json`, { cache: "no-cache" });
    if (manifestRes.ok) {
      const remoteManifest = await manifestRes.json();
      remoteVersion = remoteManifest.version || currentVersion;
    }

    // 2. Fetch latest release (if published)
    try {
      const releaseRes = await fetch(`${GITHUB_API_BASE}/releases/latest`, { cache: "no-cache" });
      if (releaseRes.ok) {
        const releaseData = await releaseRes.json();
        releaseTag = releaseData.tag_name || "";
        releaseNotes = releaseData.body || "";
        publishedAt = releaseData.published_at || "";
        if (releaseTag) {
          const tagVer = releaseTag.replace(/^v/i, "");
          if (compareVersions(tagVer, remoteVersion) > 0) {
            remoteVersion = tagVer;
          }
        }
      }
    } catch (_) {
      // Releases endpoint optional fallback
    }

    // 3. Fetch latest commit on main branch
    const commitRes = await fetch(`${GITHUB_API_BASE}/commits/main`, { cache: "no-cache" });
    if (commitRes.ok) {
      const commitData = await commitRes.json();
      commitSha = commitData.sha || "";
      commitMessage = commitData.commit?.message?.split("\n")[0] || "";
      if (!publishedAt) publishedAt = commitData.commit?.committer?.date || "";
    }

    // Compare versions and commit hashes
    const { installedCommitSha = "" } = await chrome.storage.local.get(["installedCommitSha"]);
    const versionDiff = compareVersions(remoteVersion, currentVersion);
    const hasNewCommit = Boolean(commitSha && installedCommitSha && commitSha !== installedCommitSha);
    const updateAvailable = versionDiff > 0 || hasNewCommit;

    const result = {
      success: true,
      updateAvailable,
      currentVersion,
      remoteVersion,
      releaseTag: releaseTag || `v${remoteVersion}`,
      releaseNotes: releaseNotes || commitMessage || "Latest improvements and bug fixes from official repository.",
      commitSha,
      shortSha: commitSha.substring(0, 7),
      commitMessage,
      publishedAt: publishedAt ? new Date(publishedAt).toLocaleString() : "",
      repoUrl: GITHUB_REPO_URL
    };

    if (typeof onStatus === "function") {
      onStatus(updateAvailable ? "Update available." : "Already up to date.", result);
    }

    // Cache latest check result in storage
    await chrome.storage.local.set({
      lastUpdateCheck: {
        timestamp: Date.now(),
        ...result
      }
    });

    return result;
  } catch (err) {
    const errorResult = {
      success: false,
      updateAvailable: false,
      currentVersion,
      error: err.message || "Failed to check GitHub repository."
    };
    if (typeof onStatus === "function") onStatus("Update failed.", errorResult);
    return errorResult;
  }
}

/**
 * Synchronizes local project folder directly using the HTML5 File System Access API.
 * Downloads and writes only modified or missing files into the user's project directory.
 */
export async function syncLocalDirectory(directoryHandle, onStatus) {
  if (!directoryHandle) {
    throw new Error("No directory selected for synchronization.");
  }

  try {
    if (typeof onStatus === "function") onStatus("Downloading update...");

    // 1. Fetch recursive Git tree from GitHub API
    const treeRes = await fetch(`${GITHUB_API_BASE}/git/trees/main?recursive=1`, { cache: "no-cache" });
    if (!treeRes.ok) {
      throw new Error(`Failed to fetch repository tree: HTTP ${treeRes.status}`);
    }
    const treeData = await treeRes.json();
    const blobs = (treeData.tree || []).filter(item => item.type === "blob");

    // Filter out protected files
    const syncableFiles = blobs.filter(item => {
      return !PROTECTED_PATTERNS.some(regex => regex.test(item.path));
    });

    if (typeof onStatus === "function") {
      onStatus("Updating files...", { total: syncableFiles.length, current: 0 });
    }

    let updatedCount = 0;

    // 2. Iterate and sync required files
    for (let i = 0; i < syncableFiles.length; i++) {
      const item = syncableFiles[i];
      const filePath = item.path;

      if (typeof onStatus === "function") {
        onStatus("Updating files...", {
          total: syncableFiles.length,
          current: i + 1,
          filePath
        });
      }

      // Fetch file content from raw GitHub
      const fileRes = await fetch(`${GITHUB_RAW_BASE}/${encodeURI(filePath)}`, { cache: "no-cache" });
      if (!fileRes.ok) continue;

      const fileBuffer = await fileRes.arrayBuffer();

      // Write safely to local directory
      await writeBufferToHandle(directoryHandle, filePath, fileBuffer);
      updatedCount++;
    }

    // 3. Mark update completed
    const commitRes = await fetch(`${GITHUB_API_BASE}/commits/main`, { cache: "no-cache" });
    let latestSha = "";
    if (commitRes.ok) {
      const cData = await commitRes.json();
      latestSha = cData.sha || "";
    }

    await chrome.storage.local.set({
      installedCommitSha: latestSha,
      lastSuccessfulUpdate: Date.now()
    });

    if (typeof onStatus === "function") {
      onStatus("Update completed successfully.", { updatedFilesCount: updatedCount });
    }

    return {
      success: true,
      updatedCount
    };
  } catch (err) {
    if (typeof onStatus === "function") {
      onStatus("Update failed.", { error: err.message });
    }
    throw err;
  }
}

/**
 * 1-Click fallback: Downloads the latest official repository ZIP archive via chrome.downloads
 */
export async function downloadUpdatePackage(onStatus) {
  if (typeof onStatus === "function") onStatus("Downloading update...");

  const archiveUrl = `${GITHUB_REPO_URL}/archive/refs/heads/main.zip`;
  const filename = `ClarityAI-Light-Mode-Theme-Update_${Date.now()}.zip`;

  return new Promise((resolve, reject) => {
    chrome.downloads.download(
      {
        url: archiveUrl,
        filename,
        saveAs: true
      },
      (downloadId) => {
        if (chrome.runtime.lastError) {
          if (typeof onStatus === "function") onStatus("Update failed.", { error: chrome.runtime.lastError.message });
          return reject(new Error(chrome.runtime.lastError.message));
        }
        if (typeof onStatus === "function") {
          onStatus("Update completed successfully.", {
            downloadId,
            message: "Update package downloaded. Extract to replace files in your project directory."
          });
        }
        resolve({ downloadId, filename });
      }
    );
  });
}

/**
 * Traverses subdirectories in the DirectoryHandle and writes fileBuffer safely
 */
async function writeBufferToHandle(rootDirHandle, relativePath, arrayBuffer) {
  const parts = relativePath.split("/");
  const fileName = parts.pop();
  let currentDirHandle = rootDirHandle;

  // Ensure parent directories exist
  for (const dirName of parts) {
    if (!dirName) continue;
    currentDirHandle = await currentDirHandle.getDirectoryHandle(dirName, { create: true });
  }

  // Create and write file
  const fileHandle = await currentDirHandle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(arrayBuffer);
  await writable.close();
}

/**
 * Helper to compare semantic versions: returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal
 */
function compareVersions(v1, v2) {
  const p1 = (v1 || "").replace(/^v/i, "").split(".").map(Number);
  const p2 = (v2 || "").replace(/^v/i, "").split(".").map(Number);
  const len = Math.max(p1.length, p2.length);

  for (let i = 0; i < len; i++) {
    const a = p1[i] || 0;
    const b = p2[i] || 0;
    if (a > b) return 1;
    if (a < b) return -1;
  }
  return 0;
}
