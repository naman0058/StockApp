var express = require('express');
var router = express.Router();
var upload = require('./multer');
const readXlsxFile = require('read-excel-file/node')
const csvToJson = require('csvtojson');

/* GET home page. */
router.get('/csv', function(req, res, next) {
  res.render('csv_index', { title: 'Express' });
});


router.get('/xlsx', function(req, res, next) {
  res.render('xlsx_index', { title: 'Express' });
});


router.post('/csv',upload.single('file'), async(req,res)=>{
  let body = req.body
  body['file'] = req.file.filename
    const recipients = await csvToJson({
        trim:true
    }).fromFile(`public/images/${req.body.file}`);
    res.render('csv',{rows:recipients})



    // Code executes after recipients are fully loaded.
    // recipients.forEach((recipient) => {
    //     console.log(recipient.name, recipient.email);
    // });

    // res.json(recipients)
  
})



// Read XLSX File

router.post('/xlsx',upload.single('file'),(req,res)=>{
  let body = req.body
  body['file'] = req.file.filename
  readXlsxFile(`public/images/${req.body.file}`).then((rows) => {
    // res.json(rows)
    if(rows[0]){
    res.render('xlsx',{rows})
    }
    else{
      res.json({msg:'please upload Excel File...Do not use csv file'})
    }

  })
})

module.exports = router;
