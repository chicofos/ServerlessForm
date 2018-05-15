const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

const SES = new AWS.SES();

function sendEmail(formData, callback){

  const emailParams = {
    Source : 'fco.ochoas@gmail.com',
    ReplyToAddresses: [formData.reply_to],
    Destination: {
      ToAddresses: ['fco.ochoas@gmail.com']
    },
    Message: {
      Body: {
        Text:{
          Charset: 'UTF-8',
          Data: `${formData.message}\n\nName: ${formData.name}\nEmail: ${formData.reply_to}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'New message from AWS',
      },
    },
  };

  SES.sendEmail(emailParams, callback);
}

module.exports.staticSiteMailer = (event, context, callback) => {
 
  const formData = JSON.parse(event.body);
  
  sendEmail(formData, function(err,data){
    const response = {
      statusCode: err ? 500 : 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: err ? err.message : data,
      }),
    };

    callback(null, response);

  });
};