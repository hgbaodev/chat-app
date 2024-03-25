export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result;
      const subString = file.name.split('.');
      resolve({
        file_name: file.name,
        file_size: file.size,
        file_type: subString[subString.length - 1],
        base64: base64String
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function blobToFile(blob, fileName) {
  const file = new File([blob], fileName, { type: blob.type });
  return file;
}
