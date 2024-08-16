const {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} = require("firebase/storage");
const fireApp = require("./fireApp");

let storage = getStorage(fireApp);

async function FileUpload(req, res, next) {
  let path = req.filePath;
  const storageRef = ref(storage, path);
  const metadata = {contentType: req.file.mimetype};
  const snapshot = await uploadBytesResumable(
    storageRef,
    req.file.buffer,
    metadata
  );
  const downloadUrl = await getDownloadURL(snapshot.ref);
  req.fileDownloadUrl = downloadUrl;
  next();
}

module.exports = { FileUpload };
// `apps/${id}/${Date.now() + req.file.originalname}
