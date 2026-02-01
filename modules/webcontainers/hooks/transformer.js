export function transformToWebContainerFormat(template) {
  function processItem(item) {
    // Directory
    if (item.folderName && item.items) {
      const directoryContents = {};

      item.items.forEach((subItem) => {
        const key = subItem.fileExtension
          ? `${subItem.filename}.${subItem.fileExtension}`
          : subItem.folderName;

        directoryContents[key] = processItem(subItem);
      });

      return {
        directory: directoryContents,
      };
    }

    // File
    return {
      file: {
        contents: item.content,
      },
    };
  }

  const result = {};

  template.items.forEach((item) => {
    const key = item.fileExtension
      ? `${item.filename}.${item.fileExtension}`
      : item.folderName;

    result[key] = processItem(item);
  });

  return result;
}
