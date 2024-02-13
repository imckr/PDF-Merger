import express from 'express';
import path from 'path';
import PDFMerger from 'pdf-merger-js';
import multer from 'multer';

const app = express();
var merger = new PDFMerger();
const upload = multer({ dest: 'uploads/' })
app.use("/static", express.static("public"));
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 3000;

const mergerPDFs = async (p1, p2) => {
  await merger.add(p1); //merge all pages. parameter is the path to file and filename.
  await merger.add(p2);
  //   await merger.add("pdf2.pdf", 2); // merge only page 2
  //   await merger.add("pdf2.pdf", [1, 3]); // merge the pages 1 and 3
  //   await merger.add("pdf2.pdf", "4, 7, 8"); // merge the pages 4, 7 and 8
  //   await merger.add("pdf3.pdf", "3 to 5"); //merge pages 3 to 5 (3,4,5)
  //   await merger.add("pdf3.pdf", "3-5"); //merge pages 3 to 5 (3,4,5)

  // Set metadata
  //   await merger.setMetadata({
  //     producer: "pdf-merger-js based script",
  //     author: "John Doe",
  //     creator: "John Doe",
  //     title: "My live as John Doe",
  //   });

  await merger.save("public/merged.pdf"); //save under given name and reset the internal document

  // Export the merged PDF as a nodejs Buffer
  // const mergedPdfBuffer = await merger.saveAsBuffer();
  // fs.writeSync('merged.pdf', mergedPdfBuffer);
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "template/index.html"));
});

app.post("/merge", upload.array("pdfs", 2), function (req, res, next) {
    console.log(req.files)
    mergerPDFs(path.join(__dirname, req.files[0].path), path.join(__dirname, req.files[1].path))
    res.redirect("http://localhost:3000/static/merged.pdf")
    // req.files is array of `pdf` files
    // req.body will contain the text fields, if there were any
});


app.listen(port, () => {
  console.log(`app listening on port http://localhost:${port}`);
});