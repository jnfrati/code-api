const https = require('https')
module.exports = async (problem, solution)=>{

        var options = {
            'method': 'POST',
            'hostname': 'alpha.v2.api.judge0.com',
            'path': '/submissions/?base64_encoded=false&wait=true',
            'headers': {
                'Content-Type': 'application/json'
            }
        };
        const test_cases = problem.testCases.map((test_case)=>{
            return {input: test_case.input, output:test_case.output}
        })


        var postData ={  
            source: solution.source_code,
            language_id: solution.language, 
            test_cases
        };
        console.log(postData)
        var request = https.request(options, res=>{
            var chunks = [];

            res.on("data", function (chunk) {
              chunks.push(chunk);
            });
          
            res.on("end", function (chunk) {
              const body = JSON.parse(Buffer.concat(chunks).toString())
              var success = true
              var error = ''
              var cont=0;
              body.results.map((result, i = ++cont)=>{
                console.log(result + '\n' + i);
                if(result.status.id != 3){
                    success = false
                    if(result.status.id == 4)
                        error = result.status.description + 
                                " input: " + test_cases[i].input + 
                                " output esperada: " + test_cases[i].output +
                                " output obtenida: " + result.stdout;
                    else
                        error = result.status.description
                    return;
                }
              })
              console.log(error);
              solution.success = success;
              solution.error = error;
              solution.save()              
            });

        }).on("error", err => {
            throw err
        });

        request.write(JSON.stringify(postData));

        request.end();
}