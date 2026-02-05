export function formatFileNameAsTitle(fileName: string): string {
    if (!fileName) return "";

    // Remove the file extension (everything after the last dot)
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");

    // Replace separators (-, _, .) with spaces
    // Note: we already removed the extension so dots here might be part of the name
    const nameWithSpaces = nameWithoutExtension.replace(/[-_.]/g, " ");

    // Trim extra spaces and capitalize the first letter of each word
    return nameWithSpaces
        .split(" ")
        .filter((word) => word.length > 0)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}
