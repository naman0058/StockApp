var express = require('express');
var router = express.Router();
const readXlsxFile = require('read-excel-file/node')
const csvToJson = require('csvtojson');


const { rtConnect, rtDisconnect, rtSubscribe, rtUnsubscribe, rtFeed, historical, formatTime } = require('truedata-nodejs')


rtDisconnect()




const user = 'wssand050'
const pwd = 'john050'
const port = 8084
const symbols = ['NIFTY-I', 'BANKNIFTY-I', 'CRUDEOIL-I', 'INFY']; // symbols in array format


rtConnect(user, pwd, symbols, port, bidask = 1, heartbeat = 0, replay = 0);

historical.auth(user, pwd );

// rtFeed.on('touchline', touchlineHandler);
// rtFeed.on('tick', tickHandler);
// rtFeed.on('bidask', bidaskHandler);
// rtFeed.on('bar', barHandler);
// rtFeed.on('marketstatus', marketStatusHandler)
// rtFeed.on('heartbeat', heartbeatHandler);

function touchlineHandler(touchline) {
  console.log(touchline);
}

function tickHandler(tick) {
  console.log(tick);
}

function bidaskHandler(bidask) {
  console.log(bidask);
}

function barHandler(bar) {
  console.log(bar);
}

function marketStatusHandler(status) {
  console.log(status);
}

function heartbeatHandler(heartbeat) {
    console.log(heartbeat);
}


function touchlineHandler(touchline){
  rtFeed.on('touchline', touchlineHandler);
  // console.log('abc ka data',touchline)
  Data =  touchline;  
  return touchline;
  
}
// rtDisconnect()

var Data = touchlineHandler()



router.get('/live-data-feed',(req,res)=>{
 const withNestedKeys = Object.entries(Data).map(entry => entry[1]);
res.render('CSV/data-read',{rows:withNestedKeys})
})



router.get('/',(req,res)=>{
  
   historical.auth(user, pwd );

  from = formatTime(2022, 3, 15, 15, 15); // (year, month, date, hour, minute) // hour in 24 hour format
  to = formatTime(2022, 3, 18, 18, 15); // (year, month, date, hour, minute) // hour in 24 hour format
  
  historical
  .getBarData(req.query.id,  (duration = '1W'), (interval = 'EOD'), (response = 'json'), (getSymbolId = 0))
  .then((resu) => res.render('CSV/data-read-details',{rows:resu,id:req.query.id}))
  .catch((err) => console.log(err));
})


router.get('/data-read-details-date-wise',(req,res)=>{
  


let arr = []
  var chunks = req.query.date.split(/\s+/);
   arr = [chunks.shift(), chunks.join('')];


  let removestring = arr[1].toString().replace('-','')

  let from = arr[0].split('/')
  let to = removestring.split('/')

  
 from = formatTime(from[2], from[0].replace(/^0/,''), from[1].replace(/^0/,''), 9, 15); // (year, month, date, hour, minute) // hour in 24 hour format
 to = formatTime(to[2], to[0].replace(/^0/,''), to[1].replace(/^0/,''), 9, 15); // (year, month, date, hour, minute) // hour in 24 hour format
 


 historical
 .getBarData(req.query.id,  from,to, (interval = 'EOD'), (response = 'json'), (getSymbolId = 0))
 .then((resu) => res.render('CSV/data-read-details',{rows:resu,id:req.query.id}))
 .catch((err) => console.log(err));
})



// historical data reading start





// historical data reading ends

















/* GET home page. */
router.get('/csv', function(req, res, next) {
  res.render('CSV/csv_index', { title: 'Express' });
});


router.get('/xlsx', function(req, res, next) {
  res.render('CSV/xlsx_index', { title: 'Express' });
});


router.post('/csv',upload.single('file'), async(req,res)=>{
  let body = req.body
  body['file'] = req.file.filename
    const recipients = await csvToJson({
        trim:true
    }).fromFile(`public/images/${req.body.file}`);
    res.render('CSV/csv',{rows:recipients})



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
    res.render('CSV/xlsx',{rows})
    }
    else{
      res.json({msg:'please upload Excel File...Do not use csv file'})
    }

  })
})

module.exports = router;
